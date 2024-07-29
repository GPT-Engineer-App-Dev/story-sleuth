import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Top 100 Hacker News Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading && <SkeletonLoader />}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <ul className="space-y-4">
        {filteredStories.map((story) => (
          <li key={story.objectID} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
            <p className="text-sm text-gray-600 mb-2">Upvotes: {story.points}</p>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                Read More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="bg-white p-4 rounded shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    ))}
  </div>
);

export default Index;
