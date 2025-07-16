// import InfiniteMenu from './InfiniteMenu';

// const items = [
//   {
//     image: 'https://picsum.photos/300/300?grayscale',
//     link: 'https://google.com/',
//     title: 'Item 1',
//     description: 'This is pretty cool, right?'
//   },
//   {
//     image: 'https://picsum.photos/400/400?grayscale',
//     link: 'https://google.com/',
//     title: 'Item 2',
//     description: 'This is pretty cool, right?'
//   },
//   {
//     image: 'https://picsum.photos/500/500?grayscale',
//     link: 'https://google.com/',
//     title: 'Item 3',
//     description: 'This is pretty cool, right?'
//   },
//   {
//     image: 'https://picsum.photos/600/600?grayscale',
//     link: 'https://google.com/',
//     title: 'Item 4',
//     description: 'This is pretty cool, right?'
//   }
// ];

// const ShowcaseKarya = () => (
//   <div style={{ height: '600px', position: 'relative', background: '#111'  }}>
//     <InfiniteMenu items={items} />
//   </div>
// );

// export default ShowcaseKarya;



// frontend/src/app/components/ShowcaseKarya.tsx

'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Box, Button, Heading, Text, Flex, Spinner, useToast } from '@chakra-ui/react';
import InfiniteMenu from './InfiniteMenu';

// Tipe untuk 'work' dari API kita
interface Work {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Ubah nama field agar cocok dengan `InfiniteMenu`
  link?: string;
  voteCount: number;
}

// Map data dari API ke format yang dibutuhkan oleh InfiniteMenu
const mapApiDataToItems = (works: Work[]) => {
  return works.map(work => ({
    id: work.id,
    title: work.title,
    description: work.description,
    image: work.imageUrl, // Mapping imageUrl -> image
    link: work.link,
    voteCount: work.voteCount,
  }));
};

export default function ShowcaseKarya() {
  const { data: session, status } = useSession();
  const [works, setWorks] = useState<Work[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work`);
        if (res.ok) {
          const data = await res.json();
          setWorks(data);
        }
        // Nanti kita akan tambahkan logic untuk cek status vote di sini
      } catch (error) {
        console.error("Failed to fetch works:", error);
        toast({ title: "Error", description: "Could not load showcase items.", status: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Hanya fetch saat komponen pertama kali dimuat

  const handleVote = async (workId: string) => {
    // Di sini kita akan tambahkan logika untuk mengirim vote ke API
    if (hasVoted) {
      toast({ title: "You have already voted.", status: "warning" });
      return;
    }
    
    // Asumsi vote berhasil untuk demo
    toast({ title: "Vote Submitted!", status: "success" });
    setHasVoted(true);
    // Update vote count di UI secara optimis
    const updatedWorks = works.map(w => w.id === workId ? { ...w, voteCount: w.voteCount + 1 } : w);
    setWorks(updatedWorks);
  };

  if (isLoading) {
    return <Flex justify="center" align="center" h="600px" bg="#111"><Spinner color="white" size="xl" /></Flex>;
  }

  return (
    <Box h="600px" position="relative" bg="#111">
       <Flex direction="column" align="center" position="absolute" top="40px" left="50%" transform="translateX(-50%)" zIndex={10} color="white">
        <Heading>Showcase</Heading>
        {status === 'unauthenticated' && <Button mt={4} colorScheme="blue" onClick={() => signIn('google')}>Login with Google to Vote</Button>}
        {status === 'authenticated' && hasVoted && <Text mt={4} p={2} bg="green.500" borderRadius="md">✅ You have already voted!</Text>}
       </Flex>

      <InfiniteMenu 
        items={mapApiDataToItems(works)} // Gunakan data dari API
        session={session}
        hasVoted={hasVoted}
        onVote={handleVote} // Teruskan fungsi handleVote
      />
    </Box>
  );
}