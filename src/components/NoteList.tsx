import { VStack, Link as ChakraLink } from "@chakra-ui/react";
import NoteItem from "./NoteItem";
import { Note } from "@/types/notes";
import NextLink from "next/link";

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const truncateContent = (content: string, length: number = 200) => {
    return content.length > length ? `${content.substring(0, length)}...` : content;
  };

  return (
    <VStack spacing={4} align="stretch">
      {notes.map((note) => (
        <NextLink key={note.id} href={`/dashboard/notes/${note.slug}`} passHref>
          <ChakraLink _hover={{ textDecoration: "none" }}>
            <NoteItem
              note={{ ...note, content: truncateContent(note.content) }}
            />
          </ChakraLink>
        </NextLink>
      ))}
    </VStack>
  );
};

export default NoteList;
