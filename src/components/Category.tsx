import { useState, useEffect } from 'react';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '@/services/categoryService';
import { Category } from '@/types/category';
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

const CategoriesComponent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadCategories(page);
  }, [page]);

  const loadCategories = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchCategories(page);
      setCategories(data.results);
      setCount(data.count);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name });
        toast({ title: 'Category updated.', status: 'success', duration: 3000, isClosable: true });
      } else {
        await createCategory({ name });
        toast({ title: 'Category created.', status: 'success', duration: 3000, isClosable: true });
      }
      loadCategories(page);
      resetForm();
    } catch (error) {
      toast({ title: 'An error occurred.', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      toast({ title: 'Category deleted.', status: 'success', duration: 3000, isClosable: true });
      loadCategories(page);
    } catch (error) {
      toast({ title: 'An error occurred.', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setName('');
  };

  return (
    <Container maxW="container.md" mt={10}>
      <Heading as="h1" mb={6}>Category Management</Heading>

      {/* Form for adding/editing categories */}
      <Box p={6} shadow="lg" borderWidth="2px" borderRadius="lg" mb={6}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {editingCategory ? 'Update Category' : 'Create Category'}
          </Button>
          {editingCategory && (
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </Stack>
      </Box>

      {/* Table for displaying categories */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>
                <Button size="sm" colorScheme="yellow" onClick={() => handleEdit(category)}>
                  Edit
                </Button>
                <Button size="sm" colorScheme="red" ml={2} onClick={() => handleDelete(category.id)}>
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
        Page {page} of {Math.ceil(count / categories.length)}
      </Box>
    </Container>
  );
};

export default CategoriesComponent;
