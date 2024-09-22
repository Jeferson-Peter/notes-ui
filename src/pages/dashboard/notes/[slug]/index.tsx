import { GetServerSideProps } from 'next';
import { Box, Container, Heading, Text, Stack, Tag, Badge, Icon, Button } from "@chakra-ui/react";
import { FaStar, FaTag, FaHistory } from "react-icons/fa";
import { Note } from "@/types/notes";
import { fetchNote, toggleFavorite } from "@/services/noteService";
import { useState } from 'react';
import Link from 'next/link';

interface NoteDetailProps {
  note: Note;
}

const NoteDetail: React.FC<NoteDetailProps> = ({ note: initialNote }) => {
  const [note, setNote] = useState(initialNote);
  const [loading, setLoading] = useState(false);

  // Function to handle the favorite toggle
  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      const updatedNote = await toggleFavorite(note.id);
      console.log("handleToggleFavorite -> updatedNote: ", updatedNote);

      // Mesclando o note original com os dados retornados da API
      setNote((prevNote) => ({
        ...prevNote,   // Mantém os campos anteriores
        ...updatedNote // Sobrescreve apenas os campos atualizados
      }));
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" mt={10}>
      <Box
        p={6}
        shadow="lg"
        borderWidth="2px"
        borderRadius="lg"
        borderColor={note.is_favorite ? "yellow.400" : "gray.600"}
        bg={note.is_favorite ? "yellow.50" : "gray.800"}
        position="relative"
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h1" size="xl" color="white">
            {note.title}
          </Heading>
          {note.is_favorite && (
            <Badge colorScheme="yellow" variant="solid" fontSize="0.8em" p={2} borderRadius="md">
              <Icon as={FaStar} mr={2} />
              FAVORITE
            </Badge>
          )}
        </Stack>

        <Text mt={4} fontSize="md" color="gray.300" lineHeight="tall" letterSpacing="wide">
          {note.content}
        </Text>
        <Text mt={4} fontSize="sm" color="gray.400">
          <Icon as={FaTag} mr={2} />
          Category: {note.category}
        </Text>

        {/* Add a fallback for note.tags to avoid map error */}
        <Stack direction="row" spacing={2} mt={3}>
          {note.tags?.map((tag) => (
            <Tag key={tag.id} size="md" variant="solid" colorScheme="blue">
              {tag.name}
            </Tag>
          )) || <Text color="gray.500">No tags available</Text>}
        </Stack>

        <Text mt={4} fontSize="sm" color="gray.500">
          Created at: {new Date(note.created_at).toLocaleString()}
        </Text>

        {/* Button to Toggle Favorite Status */}
        <Stack direction="row" spacing={4} mt={4}>
          <Button
            onClick={handleToggleFavorite}
            colorScheme={note.is_favorite ? "yellow" : "gray"}
            leftIcon={<FaStar />}
            isLoading={loading}
          >
            {note.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>

          {/* Button to navigate to the note's history */}
          <Link href={`${note.id}/history`} passHref>
            <Button colorScheme="blue" leftIcon={<FaHistory />}>
              View History
            </Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  );
};

// Fetch note data from server-side props
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params!;
  console.log("slug: ", slug)
  const note = await fetchNote(slug as string, ctx);
  return {
    props: {
      note,
    },
  };
};

export default NoteDetail;
