import { useState, useEffect } from 'react';
import {
    fetchTags,
    createTag,
    updateTag,
    deleteTag
} from '@/services/tagService';
import { Tag } from '@/types/tags';
import {
    Box,
    Container,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Input,
    Stack,
    FormControl,
    FormLabel,
    useToast,
} from '@chakra-ui/react';

const TagsComponent: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadTags(page);
  }, [page]);

  const loadTags = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchTags(page);
      setTags(data.results);
      setCount(data.count);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingTag) {
        await updateTag(editingTag.id, { name });
        toast({ title: 'Tag updated.', status: 'success', duration: 3000, isClosable: true });
      } else {
        await createTag({ name });
        toast({ title: 'Tag created.', status: 'success', duration: 3000, isClosable: true });
      }
      loadTags(page);
      resetForm();
    } catch (error) {
      toast({ title: 'An error occurred.', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setName(tag.name);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTag(id);
      toast({ title: 'Tag deleted.', status: 'success', duration: 3000, isClosable: true });
      loadTags(page);
    } catch (error) {
      toast({ title: 'An error occurred.', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const resetForm = () => {
    setEditingTag(null);
    setName('');
  };

  return (
    <Container maxW="container.md" mt={10}>
      <Heading as="h1" mb={6}>Tag Management</Heading>

      {/* Form for adding/editing tags */}
      <Box p={6} shadow="lg" borderWidth="2px" borderRadius="lg" mb={6}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {editingTag ? 'Update Tag' : 'Create Tag'}
          </Button>
          {editingTag && (
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </Stack>
      </Box>

      {/* Table for displaying tags */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tags.map((tag) => (
            <Tr key={tag.id}>
              <Td>{tag.name}</Td>
              <Td>
                <Button size="sm" colorScheme="yellow" onClick={() => handleEdit(tag)}>
                  Edit
                </Button>
                <Button size="sm" colorScheme="red" ml={2} onClick={() => handleDelete(tag.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Pagination controls */}
      <Stack direction="row" justifyContent="space-between" mt={4}>
        <Button onClick={() => setPage(page - 1)} isDisabled={!previousPage}>
          Previous
        </Button>
        <Button onClick={() => setPage(page + 1)} isDisabled={!nextPage}>
          Next
        </Button>
      </Stack>

      <Box mt={4} textAlign="center">
        Page {page} of {Math.ceil(count / tags.length)}
      </Box>
    </Container>
  );
};

export default TagsComponent;
