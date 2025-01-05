import ReactQuill from "react-quill";
import {useEffect, useRef, useState} from "react";
import "../../../../node_modules/react-quill/dist/quill.snow.css";
import { Box, Button } from "@chakra-ui/react";
import { BsStars } from "react-icons/bs";
import { keyframes } from '@emotion/react';

export function TextEditor({formData,updateFormData,field}) {
    const [inputText, setInputText] = useState(formData);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        saveDescription();
    }, [inputText]);

    const handleProcess = async () => {
        setLoading(true);

        let outputText='';
        try {
            const response = await fetch(`https://colocation-ai-api.thankfulwave-ff95b3d5.australiaeast.azurecontainerapps.io/process`, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: inputText,  // Ensure inputText is a string containing the raw text
            });
            
            setInputText('')

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;

            while (!done) {
                const { value, done: streamDone } = await reader.read();
                done = streamDone;
                if (value) {
                    const chunk = decoder.decode(value);

                    outputText= outputText + chunk
                    setInputText(outputText); // Append each chunk to output
                }
            }
        } catch (error) {
            console.error("Error processing text:", error);
        } finally {
            // console.log(outputText)
            saveDescription()
            setLoading(false);
        }

    };



    const saveDescription=()=>{
        updateFormData(field, inputText)
    }


    return (
        <>

            <Button
                iconSpacing={2}
                leftIcon={<BsStars size={'19px'} />}
                color='white'
                mb={2}
                justifySelf={"right"}
                display='flex'
                borderRadius='full'
                size='sm'
                isdisabled={loading}
                bgGradient="linear(to-r, purple.400, pink.400, orange.400 , purple.400)"
                backgroundSize="200% auto"
                animation={loading ? `${shimmer} 3s linear infinite` : undefined}
                _hover={{
                    bgGradient: "linear(to-r, purple.500, pink.500, orange.500)",
                }}
                _active={{
                    bgGradient: "linear(to-r, purple.600, pink.600, orange.600)",
                    transform: 'scale(0.95)',
                }}
                onClick={handleProcess}

            >
                Correct AI
            </Button>

            <ReactQuill placeholder={"Add a description..."} theme="snow" readOnly={loading} formats={formats}   modules={modules} value={inputText} onChange={setInputText} />
        </>
    );
}

const modules = {
    toolbar: [
        [{ 'header': "1" }, { 'header': "2" }, { 'header': [3, 4] }],
        ['bold', 'italic', 'underline', 'strike'],
        // [{ 'color': ['black', '#c0c1c2', '#333333', '#006400', '#8a2be2', '#8b0000', '#00008b', '#4682b4', '#228b22'] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        // ['link'],
        ['clean']
    ],
};

const formats = [
    'header',
    // 'color',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    // 'link'
];
const shimmer = keyframes`
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  `;