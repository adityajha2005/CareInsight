'use client'

import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {motion} from 'motion/react'
import ScrollButton from '@/components/ScrollButton';
import {illnessesData} from './illnessesData';
const spring_transition = {
    type: "spring",
    stiffness: 200, // Controls how tight the spring is
    damping: 30,    // Controls the resistance of the spring
    bounce: 0.5,    // Controls the amount of bounce (0 to 2 is common)
    duration: 0.6,  // Optional, spring usually ignores this unless combined
}

const IllnessesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [openCards, setOpenCards] = useState<{ [key: string]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; 

    const filteredIllnesses = illnessesData.filter(illness =>
        illness.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredIllnesses.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredIllnesses.slice(indexOfFirstItem, indexOfLastItem);

    const toggleCard = (index: string) => {
        setOpenCards(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto md:p-8">
                <h1  id="#top" className="text-center text-2xl md:text-5xl font-mono bold text-primary mb-8 md:leading-3">Disease Catalogue</h1>
                <p className="text-center pb-5">Find your resources here.</p>

                {/* Search Bar */}
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search for an illness..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 w-1/2 rounded-md bg-input text-text"
                    />
                </div>

                {/* Illness Cards */}
                <motion.div initial={{y: "100%", opacity: 0, filter: "blur(10px)"}}
                            animate={{y: 0, opacity: 1, filter: "blur(0px)"}} transition={spring_transition}>
                    <div className="flex flex-col gap-8 items-center">
                        {currentItems.map((illness, index) => (
                            <div
                                key={index}
                                className="bg-card text-text p-6 rounded-lg shadow-lg border-2 border-gray-500 w-full md:w-1/2"
                            >
                                <h2 className="text-2xl font-semibold text-primary text-center mb-4">{illness.name}</h2>

                                {/* Single Dropdown to Show All Sections */}
                                <Button
                                    onClick={() => toggleCard(`${index}`)}
                                    className="w-full text-left mb-4 p-3 bg-black hover:bg-gray-800 rounded-md text-white"
                                >
                                    {openCards[`${index}`] ? 'Hide Details' : 'Show Details'}
                                </Button>

                                {openCards[`${index}`] && (
                                    <div className="space-y-4 px-6 text-base"> {/* Set consistent font size */}
                                        {/* Description */}
                                        <p><strong>Description:</strong> {illness.description}</p>

                                        {/* Treatments */}
                                        <div>
                                            <strong>Treatments:</strong>
                                            <ul className="list-disc pl-6 space-y-2">
                                                {illness.treatments.map((treatment, idx) => (
                                                    <li key={idx}>
                                                        <strong>{treatment.name}:</strong> {treatment.effectiveness}%
                                                        effectiveness
                                                        <ul className="ml-6 list-inside">
                                                            {treatment.sideEffects.map((sideEffect, subIdx) => (
                                                                <li key={subIdx}>- {sideEffect}</li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Outlook */}
                                        <p><strong>Outlook:</strong> {illness.outlook}</p>

                                        {/* Duration */}
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
                        ))}
                    </div>
                        {/* pagination buttons */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8 mb-4">
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                variant="outline"
                            >
                                Previous
                            </Button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    className={currentPage === pageNum ? "bg-primary text-primary-foreground" : ""}
                                >
                                    {pageNum}
                                </Button>
                            ))}
                            
                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                variant="outline"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
            <ScrollButton /> 
        </div>
    );

}
export default IllnessesPage;