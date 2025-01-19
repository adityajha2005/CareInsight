import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function FeedbackForm({ onSubmit }: { onSubmit: (feedback: any) => void }) {
  const [rating, setRating] = useState<number | null>(null);
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    if (rating === null) return alert('Please select a rating.');
    onSubmit({ rating, comments });
    setRating(null);
    setComments('');
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold">How helpful was this analysis?</h3>
      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`p-1 ${(rating ?? 0) >= star ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => setRating(star)}
          >
            <Star />
          </button>
        ))}
      </div>
      <Textarea
        className="mt-4"
        placeholder="Leave additional feedback (optional)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <Button className="mt-4" onClick={handleSubmit}>
        Submit Feedback
      </Button>
    </div>
  );
}
