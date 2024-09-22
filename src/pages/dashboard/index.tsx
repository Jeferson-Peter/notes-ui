import { useEffect, useState } from "react";
import { Box, Container, Heading, Spinner, Button, Stack } from "@chakra-ui/react";
import NoteList from "@/components/NoteList";
import { Note } from "@/types/notes";
import { fetchNotes } from "@/services/noteService";

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  const loadNotes = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchNotes(page);
      setNotes(data.results);
      setCount(data.count);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes(page);
  }, [page]);

  return (
    <Container maxW="container.md" mt={10}>
      <Heading as="h1" mb={6}>
        My Notes
      </Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <NoteList notes={notes} />
          <Stack direction="row" justifyContent="space-between" mt={4}>
            <Button
              onClick={() => setPage(page - 1)}
              isDisabled={!previousPage}
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
              isDisabled={!nextPage}
            >
              Next
            </Button>
          </Stack>
          <Box mt={4} textAlign="center">
            Page {page} of {Math.ceil(count / notes.length)}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Home;
