// import { auth } from "@/auth";
import BlogCard, { BlogTypeCard } from "@/components/BlogCard";
import SearchForm from "@/components/SearchForm";
import { BLOGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const session = await auth();

  const { data: posts } = await sanityFetch({ query: BLOGS_QUERY, params });
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Where Stories Find Their Soul and Words Take Flight.</h1>
        <p className="sub-heading">Celebrating the Art of Expression, One Word at a Time</p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "Latest Stories"}
        </p>
        <ul className="mt-7 card_grid">
            {
              posts.length > 0 ? (
               posts.map((post: BlogTypeCard, index: number) =>(
                <BlogCard key={post?._id} blogs={post}/>
               )) 
              ) : (
                <p className="no-results">No posts found</p>
              )
            }
        </ul>
      </section>
      <SanityLive />
    </>
  );
}
