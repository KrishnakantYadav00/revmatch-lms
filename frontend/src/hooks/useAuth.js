// Quick mock auth state so routes don't crash
const useAuth = () => {
  return {
    user: {
      id: "mock123",
      name: "Professor Xavier",
      role: "instructor" // Change this to 'student' or null to test your route guards!
    },
    loading: false
  };
};

export default useAuth;