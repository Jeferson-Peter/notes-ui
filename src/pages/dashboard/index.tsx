import { Box, Heading } from "@chakra-ui/react";

const Home = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="gray.100"
    >
      <Heading>Hello, World!</Heading>
    </Box>
  );
};

export default Home;
