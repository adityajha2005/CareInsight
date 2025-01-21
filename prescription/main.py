import torch
from PIL import Image
from transformers import AutoTokenizer, AutoModelForImageTextToText, DonutProcessor
import requests
from io import BytesIO
import urllib.parse
import argparse

def load_model():
    model_name = "mjawadazad2321/donut-base-Medical_Handwritten_Prescriptions_Information_Extraction_updated"
    
    # Check for CUDA availability
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    # print(f"Using device: {device}")
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForImageTextToText.from_pretrained(
        model_name,
        ignore_mismatched_sizes=True
    ).to(device)  # Move model to appropriate device
    
    processor = DonutProcessor.from_pretrained(
        model_name,
        use_fast=True  # Use fast processor as recommended
    )
    
    # Set image size according to model config
    processor.image_processor.size = {
        "height": 960,
        "width": 720,
    }
    
    return tokenizer, model, processor, device

def is_valid_image_url(url):
    """Check if the URL points to a valid image file."""
    image_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')
    parsed_url = urllib.parse.urlparse(url)
    return parsed_url.path.lower().endswith(image_extensions)

def process_prescription(image_path, tokenizer, model, processor, device):
    try:
        # Check if the image_path is a URL
        if image_path.startswith(('http://', 'https://')):
            if not is_valid_image_url(image_path):
                raise ValueError("URL does not point to a supported image file")
            try:
                response = requests.get(image_path, timeout=10)
                response.raise_for_status()  # Raise an error for bad status codes
                image = Image.open(BytesIO(response.content)).convert('RGB')
            except requests.exceptions.RequestException as e:
                raise Exception(f"Failed to fetch image from URL: {str(e)}")
        else:
            if not any(image_path.lower().endswith(ext) for ext in ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')):
                raise ValueError("File is not a supported image format")
            image = Image.open(image_path).convert('RGB')

        pixel_values = processor(image, return_tensors="pt").pixel_values
        pixel_values = pixel_values.to(device)  # Move input to same device as model

        # Generate text from image
        task_prompt = "<extract_text>"
        decoder_input_ids = tokenizer(task_prompt, add_special_tokens=False, return_tensors="pt").input_ids
        decoder_input_ids = decoder_input_ids.to(device)  # Move input to same device as model

        with torch.no_grad():  # Disable gradient calculation for inference
            outputs = model.generate(
                pixel_values,
                decoder_input_ids=decoder_input_ids,
                max_length=512,
                early_stopping=True,
                pad_token_id=tokenizer.pad_token_id,
                eos_token_id=tokenizer.eos_token_id,
                use_cache=True,
                num_beams=4,  # Increase beam search
                temperature=1.0,
                do_sample=False,
                bad_words_ids=[[tokenizer.unk_token_id]],
                return_dict_in_generate=True,
            )

        # Decode the generated text
        prediction = tokenizer.batch_decode(outputs.sequences, skip_special_tokens=True)[0]
        
        # Clean up the prediction
        prediction = prediction.strip()
        if prediction.startswith('<extract_text>'):
            prediction = prediction[len('<extract_text>'):].strip()
            
        return prediction
    except ValueError as e:
        raise ValueError(f"Invalid input: {str(e)}")
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Process prescription images')
    parser.add_argument('--image', type=str, help='Image path or URL', required=False)
    args = parser.parse_args()

    try:
        print("Loading model...")
        tokenizer, model, processor, device = load_model()
        
        # If no argument provided, use an example URL
        image_path = args.image if args.image else input("Enter image path or URL: ")
        
        print(f"\nProcessing image: {image_path}")
        result = process_prescription(image_path, tokenizer, model, processor, device)
        
        if not result:
            print(" ")
            print("Warning: No text was extracted from the image")
        else:
            print("")
            print("Generating Response")
            print("-" * 50)
            print(result)
            print("-" * 50)
        
    except ValueError as e:
        print(f"Validation Error: {str(e)}")
    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main()