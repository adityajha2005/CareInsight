'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'motion/react';
import ScrollButton from '@/components/ScrollButton';
import { illnessesData } from './illnessesData';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IllnessesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [openCards, setOpenCards] = useState<{ [key: string]: boolean }>({});
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        duration: 30,
        loop: false
    });

    const filteredIllnesses = illnessesData.filter(illness =>
        illness.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleCard = (index: string) => {
        setOpenCards(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') scrollPrev();
            if (e.key === 'ArrowRight') scrollNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [scrollPrev, scrollNext]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-center text-3xl font-semibold text-gray-800 mb-2">
                    Disease Catalogue
                </h1>
                <p className="text-center text-gray-600 font-inter pb-5">Find your resources here.</p>

                {/* Search Bar */}
                <div className="mb-4 md:mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search for an illness..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 w-full sm:w-3/4 md:w-1/2 rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    />
                </div>

                {/* Carousel Container */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <motion.div 
                            className="flex"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {filteredIllnesses.map((illness, index) => (
                                <div
                                    key={index}
                                    className="flex-[0_0_100%] min-w-0 pl-4 first:pl-0"
                                >
                                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 w-full sm:w-3/4 md:w-1/2 mx-auto hover:shadow-xl transition-shadow">
                                        <h2 className="text-xl md:text-2xl font-semibold text-blue-600 text-center mb-3 md:mb-4">
                                            {illness.name}
                                        </h2>

                                        <Button
                                            onClick={() => toggleCard(`${index}`)}
                                            className="w-full text-left mb-3 md:mb-4 p-2 md:p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md text-sm md:text-base"
                                        >
                                            {openCards[`${index}`] ? 'Hide Details' : 'Show Details'}
                                        </Button>

                                        {openCards[`${index}`] && (
                                            <div className="space-y-3 md:space-y-4 px-3 md:px-6 text-sm md:text-base">
                                                {/* Description */}
                                                <p><strong>Description:</strong> {illness.description}</p>

                                                {/* Treatments */}
                                                <div>
                                                    <strong>Treatments:</strong>
                                                    <ul className="list-disc pl-6 space-y-2">
                                                        {illness.treatments.map((treatment, idx) => (
                                                            <li key={idx}>
                                                                <strong>{treatment.name}:</strong> {treatment.effectiveness}% effectiveness
                                                                <ul className="ml-6 list-inside">
                                                                    {treatment.sideEffects.map((sideEffect, subIdx) => (
                                                                        <li key={subIdx}>- {sideEffect}</li>
                                                                    ))}
                                                                </ul>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Outlook & Duration */}
                                                <p><strong>Outlook:</strong> {illness.outlook}</p>
                                                <p><strong>Duration:</strong> {illness.duration}</p>

                                                {/* Aggravating Factors */}
                                                <div>
                                                    <strong>Aggravating Factors:</strong>
                                                    <ul className="list-disc pl-6 space-y-2">
                                                        {Array.isArray(illness.aggravatingFactors) ? (
                                                            illness.aggravatingFactors.map((factor, idx) => (
                                                                <li key={idx}>{factor}</li>
                                                            ))
                                                        ) : (
                                                            <li>No aggravating factors available.</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg transition-opacity ${
                            !prevBtnEnabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white'
                        }`}
                        onClick={scrollPrev}
                        disabled={!prevBtnEnabled}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg transition-opacity ${
                            !nextBtnEnabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white'
                        }`}
                        onClick={scrollNext}
                        disabled={!nextBtnEnabled}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === selectedIndex
                                        ? 'bg-blue-500 w-4'
                                        : 'bg-blue-200'
                                }`}
                                onClick={() => scrollTo(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <ScrollButton />
        </div>
    );
}

export default IllnessesPage;