import { Box, Text, Tag, Stack, Badge, Icon } from "@chakra-ui/react";
import { FaStar, FaTag } from "react-icons/fa";
import { Note } from "@/types/notes";

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  return (
    <Box
      p={6}
      shadow="lg"
      borderWidth="2px"
      borderRadius="lg"
      borderColor={note.is_favorite ? "yellow.400" : "gray.600"}
      bg={note.is_favorite ? "yellow.50" : "gray.800"}
      _hover={{ shadow: "xl", transform: "scale(1.01)", transition: "all 0.2s ease-in-out" }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="bold" color="white">
          {note.title}
        </Text>
        {note.is_favorite && (
          <Badge colorScheme="yellow" variant="solid" fontSize="0.8em" p={2} borderRadius="md">
            <Icon as={FaStar} mr={2} />
            FAVORITE
          </Badge>
        )}
      </Stack>
      <Text mt={2} fontSize="md" color="gray.300">
        {note.content}
      </Text>
      <Text mt={2} fontSize="sm" color="gray.400">
        <Icon as={FaTag} mr={2} />
        Category: {note.category}
      </Text>
      <Stack direction="row" spacing={2} mt={3}>
        {note.tags.map((tag) => (
          <Tag key={tag.id} size="md" variant="solid" colorScheme="blue">
            {tag.name}
          </Tag>
        ))}
      </Stack>
      <Text mt={4} fontSize="sm" color="gray.500">
        Created at: {new Date(note.created_at).toLocaleString()}
      </Text>
    </Box>
  );
};

export default NoteItem;
