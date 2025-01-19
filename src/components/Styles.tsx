// components/Styles.js

import styled from "styled-components";

export const Heading = styled.h1`
    text-align: center;
    color: green;
`;

export const Content = styled.div`
    overflowy: scroll;
    height: 2500px;
`;

export const Button = styled.div`
    position: fixed;
    right: 40px; 
    bottom: 40px;
    height: 40px;  
    font-size: 3rem;
    z-index: 100;  
    cursor: pointer;
    color: grey-900;
`;
