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

    const getVisiblePages = (currentPage: number, totalPages: number) => {
        const pages: (number | string)[] = [];
        
        if (totalPages <= 4) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        // Show current and next page
        if (currentPage > 2) {
            pages.push('...');
        }
        
        if (currentPage !== 1 && currentPage !== totalPages) {
            pages.push(currentPage);
        }
        
        if (currentPage + 1 < totalPages) {
            pages.push(currentPage + 1);
        }

        // Show last two pages
        if (currentPage + 2 < totalPages) {
            pages.push('...');
        }
        if (currentPage + 1 !== totalPages) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mt-[9vh]">
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

                {/* Illness Cards */}
                <motion.div initial={{y: "100%", opacity: 0, filter: "blur(10px)"}}
                            animate={{y: 0, opacity: 1, filter: "blur(0px)"}} 
                            transition={spring_transition}>
                    <div className="flex flex-col gap-4 md:gap-8 items-center">
                        {currentItems.map((illness, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 w-full sm:w-3/4 md:w-1/2 hover:shadow-xl transition-shadow"
                            >
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-6 md:mt-8 mb-4">
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                variant="outline"
                                className="bg-blue-500 text-white hover:bg-blue-600 text-sm md:text-base px-2 md:px-4"
                            >
                                Previous
                            </Button>
                            
                            {getVisiblePages(currentPage, totalPages).map((pageNum, idx) => (
                                pageNum === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 self-center">...</span>
                                ) : (
                                    <Button
                                        key={`page-${pageNum}`}
                                        onClick={() => handlePageChange(pageNum as number)}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        className={`text-sm md:text-base px-2 md:px-4 ${
                                            currentPage === pageNum ? "bg-primary text-primary-foreground" : ""
                                        }`}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            ))}
                            
                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                className="bg-blue-500 text-white hover:bg-blue-600 text-sm md:text-base px-2 md:px-4"
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