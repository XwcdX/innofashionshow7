// frontend/src/app/admin/add-work/page.tsx
'use client';
import { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input,
  Textarea, VStack, Heading, useToast
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

export default function AddWorkPage() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Untuk saat ini, kita belum proteksi dengan role admin
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, imageUrl }),
    });

    if (res.ok) {
      toast({ title: "Success", description: "Work added successfully!", status: "success", duration: 3000, isClosable: true });
      setTitle(''); setDescription(''); setImageUrl('');
    } else {
      toast({ title: "Error", description: "Failed to add work.", status: "error", duration: 3000, isClosable: true });
    }
    setIsLoading(false);
  };

  if (status === 'unauthenticated' || status === 'loading') {
    return <Heading textAlign="center" p={10}>Please login to access this page.</Heading>;
  }

  return (
    <Box p={8}>
      <VStack as="form" onSubmit={handleSubmit} spacing={4} maxW="md" mx="auto">
        <Heading>Add New Showcase Work</Heading>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Image URL</FormLabel>
          <Input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={isLoading} width="full">
          Add Work
        </Button>
      </VStack>
    </Box>
  );
}