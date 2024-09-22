import { GetServerSideProps } from 'next';
import { Box, Container, Heading, Text, Stack, Badge, Icon, Tag } from "@chakra-ui/react";
import { FaStar, FaClock, FaUser } from "react-icons/fa";
import { fetchNoteHistory } from "@/services/noteService";
import { NoteHistory } from '@/types/notes'

interface NoteHistoryProps {
  history: NoteHistory[];
}

const NoteHistoryDetail: React.FC<NoteHistoryProps> = ({ history }) => {
  return (
    <Container maxW="container.md" mt={10}>
      <Heading as="h1" size="xl" color="white" mb={6}>
        Histórico de Alterações
      </Heading>

      {history.length > 0 ? (
        <Stack spacing={5}>
          {history.map((entry) => (
            <Box
              key={entry.history_id}
              p={5}
              shadow="md"
              borderWidth="2px"
              borderRadius="lg"
              bg="gray.800"
              borderColor={entry.is_favorite ? "yellow.400" : "gray.600"}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={3}>
                  {entry.is_favorite && (
                    <Badge colorScheme="yellow" variant="solid" fontSize="0.8em" p={1} borderRadius="md">
                      <Icon as={FaStar} mr={1} />
                      Favorito
                    </Badge>
                  )}
                  <Text color="gray.400">Título: {entry.title}</Text>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Icon as={FaClock} color="gray.400" />
                  <Text color="gray.400">{new Date(entry.history_date).toLocaleString()}</Text>
                </Stack>
              </Stack>
              <Text mt={4} fontSize="md" color="gray.300">
                {entry.content}
              </Text>

              <Text mt={2} fontSize="sm" color="gray.400">
                <Icon as={FaUser} mr={2} />
                Alterado por Usuário ID: {entry.history_user_id}
              </Text>

              {entry.history_change_reason && (
                <Text mt={2} fontSize="sm" color="gray.400">
                  Motivo da Alteração: {entry.history_change_reason}
                </Text>
              )}

              <Text mt={2} fontSize="sm" color="gray.500">
                Criado em: {new Date(entry.created_at).toLocaleString()}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Atualizado em: {new Date(entry.updated_at).toLocaleString()}
              </Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text color="gray.500">Nenhum histórico de alterações encontrado.</Text>
      )}
    </Container>
  );
};

// Fetching the note's history from the server
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params!; // Extraímos o noteId da URL

  try {
    console.log("slug: ", slug)
    const history = await fetchNoteHistory(slug, ctx); // Usamos a função fetchNoteHistory com o noteId
    return {
      props: {
        history: history, // Passamos o array de histórico para os props
      },
    };
  } catch (error) {
    return {
      notFound: true, // Se houver erro, retornar 404
    };
  }
};

export default NoteHistoryDetail;
