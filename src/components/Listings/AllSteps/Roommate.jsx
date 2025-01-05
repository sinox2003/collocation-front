import {Avatar, Badge, Box, Button, Divider, HStack, Spacer} from "@chakra-ui/react";
import { Text } from '@chakra-ui/react'
import {useState} from "react";

export default function Roommate ({roommate,index,roommates,updateFormData}) {



    const handleRemoveRoommate = ( ) => {
        updateFormData('roommates',roommates.filter( (r) => r.email !== roommate.email))
    }

    return(
        <Box w='full'>
            <HStack>
                <HStack spacing={5}>
                    <Badge colorScheme='purple' borderRadius='full' px='6px' py='1px'   >{index + 1 }</Badge>
                    <HStack>
                        <Avatar name={roommate?.name} size='sm'  boxSize={10} />
                        <Text fontWeight={'bold'} fontSize='lg' >{roommate?.name} </Text>
                    </HStack>
                </HStack>
                <Spacer />
                {
                    roommate?.email !== 'mohaennouass@gmail.com' &&
                    <Button variant='unslyled' color='#C41E3A' onClick={handleRemoveRoommate} >Remove</Button>
                }

            </HStack>
            <Divider mt={2} />
        </Box>
    )


}