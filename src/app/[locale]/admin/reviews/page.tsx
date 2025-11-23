"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Star,
  Trash2,
  Filter,
  MessageSquare,
  Calendar,
  ThumbsUp,
} from "lucide-react";
import { getInitials } from "@/lib/helpers";
import Link from "next/link";

interface Review {
  id: string;
  userId: string;
  tourId: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  tour: {
    id: string;
    title: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string;
    order: number;
  }>;
  response: {
    id: string;
    response: string;
    createdAt: string;
  } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [responseFilter, setResponseFilter] = useState<string>("ALL");

  // Response dialog state
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchQuery, ratingFilter, responseFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/reviews");
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    // Rating filter
    if (ratingFilter !== "ALL") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(ratingFilter)
      );
    }

    // Response filter
    if (responseFilter === "RESPONDED") {
      filtered = filtered.filter((review) => review.response !== null);
    } else if (responseFilter === "NOT_RESPONDED") {
      filtered = filtered.filter((review) => review.response === null);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(query) ||
          review.content.toLowerCase().includes(query) ||
          review.tour.title.toLowerCase().includes(query) ||
          review.user.name?.toLowerCase().includes(query) ||
          review.user.email.toLowerCase().includes(query)
      );
    }

    setFilteredReviews(filtered);
  };

  const openResponseDialog = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response?.response || "");
    setResponseDialogOpen(true);
  };

  const submitResponse = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      setSubmittingResponse(true);
      const response = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responseText.trim() }),
      });

      if (!response.ok) throw new Error("Failed to submit response");

      await fetchReviews();
      setResponseDialogOpen(false);
      setSelectedReview(null);
      setResponseText("");
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response");
    } finally {
      setSubmittingResponse(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete review");

      await fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const stats = {
    total: reviews.length,
    avgRating:
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : "0.0",
    responded: reviews.filter((r) => r.response !== null).length,
    pending: reviews.filter((r) => r.response === null).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Review Moderation
        </h1>
        <p className="mt-2 text-gray-600">
          Manage customer reviews and respond to feedback
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Total Reviews</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="text-3xl font-bold text-amber-600">
              {stats.avgRating} ★
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Responded</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.responded}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-orange-600">
              {stats.pending}
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
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={responseFilter} onValueChange={setResponseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by response" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Reviews</SelectItem>
                <SelectItem value="RESPONDED">Responded</SelectItem>
                <SelectItem value="NOT_RESPONDED">Not Responded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Loading reviews...
            </CardContent>
          </Card>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No reviews found
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar>
                        <AvatarImage
                          src={review.user.image || undefined}
                          alt={review.user.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                          {getInitials(review.user.name || review.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {review.user.name || "Anonymous"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {review.user.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResponseDialog(review)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {review.response ? "Edit Response" : "Respond"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReview(review.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tour Info */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Link
                      href={`/tours/${review.tour.slug}`}
                      className="text-sky-600 hover:text-sky-700 hover:underline font-medium"
                    >
                      {review.tour.title}
                    </Link>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {review.title}
                    </h3>
                    <p className="text-gray-700">{review.content}</p>
                  </div>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {review.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={image.alt}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Admin Response */}
                  {review.response && (
                    <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-sky-600" />
                        <span className="font-semibold text-sky-900">
                          Admin Response
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.response.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.response.response}</p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.helpful} helpful</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedReview?.response ? "Edit Response" : "Respond to Review"}
            </DialogTitle>
            <DialogDescription>
              Write a thoughtful response to this customer review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReview && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(selectedReview.rating)}
                  <span className="font-semibold">{selectedReview.title}</span>
                </div>
                <p className="text-sm text-gray-700">{selectedReview.content}</p>
              </div>
            )}
            <Textarea
              placeholder="Write your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResponseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={submitResponse}
              disabled={submittingResponse || !responseText.trim()}
            >
              {submittingResponse
                ? "Submitting..."
                : selectedReview?.response
                ? "Update Response"
                : "Submit Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
