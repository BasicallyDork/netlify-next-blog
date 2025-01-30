import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { client } from "@/sanity/lib/client";
import { auth } from "@/auth";
import { sanityFetch } from "@/sanity/lib/live";
import Page from "@/app/(root)/blog/[id]/page";

// Mock dependencies
jest.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: jest.fn(),
  },
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/sanity/lib/live", () => ({
  sanityFetch: jest.fn(),
}));

describe("Page Component", () => {
  const mockPost = {
    _id: "blog-id",
    _createdAt: "2025-01-01T00:00:00Z",
    title: "Test Blog Title",
    description: "This is a test blog description",
    content: "# Test Markdown Content",
    image: "https://via.placeholder.com/150",
    category: "Test Category",
    author: {
      _id: "author-id",
      name: "Author Name",
      username: "authorusername",
      image: "https://via.placeholder.com/64",
    },
  };

  const mockComments = [
    {
      userID: { name: "User One", _id: "user1" },
      comment: "Test comment 1",
      createdAt: "2025-01-02T10:00:00Z",
    },
    {
      userID: { name: "User Two", _id: "user2" },
      comment: "Test comment 2",
      createdAt: "2025-01-02T11:00:00Z",
    },
  ];

  const mockSession = { id: "user1", name: "User One" };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mocking API responses
    (client.fetch as jest.Mock).mockResolvedValue(mockPost);
    (auth as jest.Mock).mockResolvedValue(mockSession);
    (sanityFetch as jest.Mock).mockResolvedValue({ data: mockComments });
  });

  test("renders the blog post details", async () => {
    render(<Page params={{ id: "blog-id" }} />);

    // Blog title
    expect(await screen.findByText(mockPost.title)).toBeInTheDocument();
    // Blog description
    expect(screen.getByText(mockPost.description)).toBeInTheDocument();
    // Blog category
    expect(screen.getByText(mockPost.category)).toBeInTheDocument();
    // Author name and username
    expect(screen.getByText(mockPost.author.name)).toBeInTheDocument();
    expect(screen.getByText(`@${mockPost.author.username}`)).toBeInTheDocument();
    // Image
    const image = screen.getByAltText("thumbnail");
    expect(image).toHaveAttribute("src", mockPost.image);
  });

  test("renders markdown content", async () => {
    render(<Page params={{ id: "blog-id" }} />);

    const markdownContent = screen.getByText("Test Markdown Content", {
      selector: "article",
    });
    expect(markdownContent).toBeInTheDocument();
  });

  test("renders the comment form for logged-in users", async () => {
    render(<Page params={{ id: "blog-id" }} />);

    expect(await screen.findByPlaceholderText("Write your comment here")).toBeInTheDocument();
    expect(screen.getByText("Add Comment")).toBeInTheDocument();
  });

  test("renders comments and delete icon only for the user who authored them", async () => {
    render(<Page params={{ id: "blog-id" }} />);

    // Check if comments are rendered
    const comment1 = await screen.findByText(mockComments[0].comment);
    const comment2 = screen.getByText(mockComments[1].comment);
    expect(comment1).toBeInTheDocument();
    expect(comment2).toBeInTheDocument();

    // Check for delete icon for the first comment (belongs to the logged-in user)
    const trashIcon1 = screen.getAllByRole("img", { name: "Trash" })[0];
    expect(trashIcon1).toBeInTheDocument();

    // Ensure the second comment doesn't have the delete icon
    expect(
      screen.queryByText(mockComments[1].userID.name, {
        selector: "Trash",
      })
    ).not.toBeInTheDocument();
  });

  test("shows 'Log in to view comments' for logged-out users", async () => {
    // Simulate logged-out session
    (auth as jest.Mock).mockResolvedValue(null);

    render(<Page params={{ id: "blog-id" }} />);

    expect(await screen.findByText("Log in to view comments")).toBeInTheDocument();
  });

  test("handles no post found gracefully", async () => {
    (client.fetch as jest.Mock).mockResolvedValue(null);

    render(<Page params={{ id: "non-existent-id" }} />);

    expect(await screen.findByText("404")).toBeInTheDocument(); // Adjust if your `notFound()` shows custom text.
  });
});
