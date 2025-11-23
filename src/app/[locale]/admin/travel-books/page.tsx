"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Plus,
  Trash2,
  Eye,
  Edit,
  Filter,
  Book,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BALI_REGENCIES } from "@/lib/constants/bali-regencies";

interface TravelBookData {
  id: string;
  title: string;
  slug: string;
  description: string;
  regency: string;
  coverImage: string;
  order: number;
  published: boolean;
  createdAt: string;
  chapters: Array<{
    id: string;
    title: string;
    entries: Array<{
      id: string;
      images: Array<{
        id: string;
        url: string;
      }>;
    }>;
  }>;
  _count: {
    chapters: number;
  };
}

export default function AdminTravelBooksPage() {
  const [books, setBooks] = useState<TravelBookData[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<TravelBookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [regencyFilter, setRegencyFilter] = useState<string>("ALL");
  const [publishedFilter, setPublishedFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, regencyFilter, publishedFilter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/travel-books");
      if (!response.ok) throw new Error("Failed to fetch travel books");
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error("Error fetching travel books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    // Regency filter
    if (regencyFilter !== "ALL") {
      filtered = filtered.filter((book) => book.regency === regencyFilter);
    }

    // Published filter
    if (publishedFilter !== "ALL") {
      const isPublished = publishedFilter === "PUBLISHED";
      filtered = filtered.filter((book) => book.published === isPublished);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.slug.toLowerCase().includes(query) ||
          book.regency.toLowerCase().includes(query) ||
          book.id.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  };

  const togglePublished = async (bookId: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/travel-books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentPublished }),
      });

      if (!response.ok) throw new Error("Failed to update travel book");

      await fetchBooks();
    } catch (error) {
      console.error("Error updating travel book:", error);
      alert("Failed to update travel book");
    }
  };

  const deleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this travel book?")) return;

    try {
      const response = await fetch(`/api/admin/travel-books/${bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete travel book");

      await fetchBooks();
    } catch (error) {
      console.error("Error deleting travel book:", error);
      alert("Failed to delete travel book");
    }
  };

  const stats = {
    total: books.length,
    published: books.filter((b) => b.published).length,
    draft: books.filter((b) => !b.published).length,
    totalChapters: books.reduce((sum, b) => sum + b._count.chapters, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Travel Book Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage travel guides for Bali regencies
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Travel Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Books</div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </div>
              </div>
              <Book className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Published</div>
                <div className="text-3xl font-bold text-green-600">
                  {stats.published}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Draft</div>
                <div className="text-3xl font-bold text-amber-600">
                  {stats.draft}
                </div>
              </div>
              <XCircle className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Chapters</div>
                <div className="text-3xl font-bold text-sky-600">
                  {stats.totalChapters}
                </div>
              </div>
              <Book className="h-8 w-8 text-sky-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search travel books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={regencyFilter} onValueChange={setRegencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by regency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Regencies</SelectItem>
                {BALI_REGENCIES.map((regency) => (
                  <SelectItem key={regency.id} value={regency.name}>
                    {regency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={publishedFilter} onValueChange={setPublishedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Loading travel books...
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No travel books found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Regency</TableHead>
                    <TableHead>Chapters</TableHead>
                    <TableHead>Entries</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => {
                    const totalEntries = book.chapters.reduce(
                      (sum, chapter) => sum + chapter.entries.length,
                      0
                    );

                    return (
                      <TableRow key={book.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={book.coverImage}
                                alt={book.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {book.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {book.slug}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{book.regency}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {book._count.chapters} chapters
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {totalEntries} places
                          </div>
                        </TableCell>
                        <TableCell>
                          {book.published ? (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Draft
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {book.order}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/travel-book/${book.slug}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Book
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/travel-books/${book.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Book
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  togglePublished(book.id, book.published)
                                }
                              >
                                {book.published ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4 text-amber-600" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => deleteBook(book.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
