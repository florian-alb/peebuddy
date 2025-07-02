"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@workspace/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { MapPin, Users, CalendarPlus, Search, Filter, Eye, Check, X, Image, RefreshCw, Trash, Star, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { AlertCircle } from "lucide-react";

// Type definitions
interface ToiletData {
    id: number;
    name: string;
    location: string;
    status: string;
    addedDate: string;
}

interface PictureData {
    id: number;
    toiletId: number;
    uploadDate: string;
    status: string;
}

interface ReviewData {
    id: number;
    toiletId: number;
    userId: number;
    rating: number;
    comment: string;
    status: string;
    createdAt: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    joinDate: string;
    contributions: number;
    role: string;
}

interface Stats {
    totalToilets: number;
    verifiedToilets: number;
    totalUsers: number;
    newToilets: number;
    totalReviews: number;
    timeRange: string;
    averageRating: number;
    totalPictures: number;
    verificationRate: number;
    freeToilets: number;
    publicToilets: number;
    handicapToilets: number;
    commerceToilets: number;
    hasMoreToilets: boolean;
    hasMoreUsers: boolean;
    hasMorePictures: boolean;
    toiletsPerPage: number;
}

export default function Dashboard() {

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("toilets");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toiletsData, setToiletsData] = useState<ToiletData[]>([]);
    const [picturesData, setPicturesData] = useState<PictureData[]>([]);
    const [usersData, setUsersData] = useState<UserData[]>([]);
    const [reviewsData, setReviewsData] = useState<ReviewData[]>([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    const [token, setToken] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [sessionLoading, setSessionLoading] = useState<boolean>(true);
    const [sessionError, setSessionError] = useState<boolean>(false);
    const router = useRouter();
    const [stats, setStats] = useState<Stats>({
        totalToilets: 0,
        verifiedToilets: 0,
        totalUsers: 0,
        newToilets: 0,
        totalReviews: 0,
        timeRange: "monthly",
        averageRating: 0,
        totalPictures: 0,
        verificationRate: 0,
        freeToilets: 0,
        publicToilets: 0,
        handicapToilets: 0,
        commerceToilets: 0,
        hasMoreToilets: false,
        hasMoreUsers: false,
        hasMorePictures: false,
        toiletsPerPage: 15
    });

    const handleVerifyReview = async (reviewId: number) => {
        console.log('reviewId', reviewId);
        try {
            const response = await fetch(`/api/reviews/verify/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: reviewId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        try {
            const response = await fetch(`/api/reviews/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: reviewId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnverifyReview = async (reviewId: number) => {
        try {
            const response = await fetch(`/api/reviews/unverify/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: reviewId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            const data = await response.json();
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };


    const handleDeleteToilet = async (toiletId: number) => {
        try {
            const response = await fetch(`/api/toilets/${toiletId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerifyPicture = async (pictureId: number) => {
        try {
            const response = await fetch(`/api/pictures/verify/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: pictureId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };
    const handlePromote = async (userId: number) => {
        try {
            const response = await fetch(`/api/users/promote/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDemote = async (userId: number) => {
        try {
            const response = await fetch(`/api/users/demote/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnverifyPicture = async (pictureId: number) => {
        try {
            const response = await fetch(`/api/pictures/unverify/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: pictureId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerifyToilet = async (toiletId: number) => {
        try {
            const response = await fetch(`/api/toilets/verify/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: toiletId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnverifyToilet = async (toiletId: number) => {
        try {
            const response = await fetch(`/api/toilets/unverify/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: toiletId }),
            });
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            const data = await response.json();
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStats = async (page = 1) => {
        try {
            setIsLoading(true);
            setHasError(false);

            // Use a page size of 15 for pagination
            const pageSize = 15;
            const response = await fetch(`/api/stats?page=${page}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            setCurrentPage(data.pagination.page);

            setStats({
                totalToilets: data.toilets.total,
                verifiedToilets: data.toilets.verified.total,
                totalUsers: data.users.total,
                totalReviews: data.reviews.total,
                newToilets: data.toilets.total - data.toilets.verified.total,
                timeRange: "monthly",
                averageRating: data.reviews.averageRating,
                totalPictures: data.pictures.total,
                verificationRate: data.toilets.verificationRate,
                freeToilets: data.toilets.byType.free.total,
                publicToilets: data.toilets.byType.public.total,
                handicapToilets: data.toilets.byType.handicap.total,
                commerceToilets: data.toilets.byType.commerce.total,
                hasMoreToilets: data.pagination.hasMore.toilets,
                hasMoreUsers: data.pagination.hasMore.users,
                hasMorePictures: data.pagination.hasMore.pictures,
                toiletsPerPage: data.pagination.pageSize
            });

            const transformedToilets = data.toilets.toilets.map((toilet: any) => ({
                id: toilet.id,
                name: `Toilet #${toilet.id}`,
                location: `${toilet.latitude} Lat, ${toilet.longitude} Long`,
                status: toilet.is_verified ? "verified" : "pending",
                addedDate: new Date(toilet.created_at).toISOString().split('T')[0]
            }));
            setToiletsData(transformedToilets);

            const transformedPictures = data.pictures.pictures.map((picture: any) => ({
                id: picture.id,
                toiletId: picture.toilet_id,
                uploadDate: new Date(picture.created_at).toISOString().split('T')[0],
                status: picture.is_verified ? "verified" : "pending"
            }));
            setPicturesData(transformedPictures);
            setReviewsData(data.reviews.reviews.map((review: any) => ({
                id: review.id,
                toiletId: review.toilet_id,
                uploadDate: new Date(review.created_at).toISOString().split('T')[0],
                status: review.is_verified ? "verified" : "pending"
            })));
            // Transform paginated users data
            const transformedUsers = data.users.users.map((user: any) => {
                const contributions = 0;

                return {
                    id: user.id,
                    name: user.name || `User #${user.id}`,
                    email: user.email || "-",
                    joinDate: new Date(user.created_at).toISOString().split('T')[0],
                    contributions: contributions,
                    role: user.role
                };
            });
            setUsersData(transformedUsers);

        } catch (error) {
            console.error("Error fetching statistics:", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Get session and check if user is admin
    const getSession = async () => {
        try {
            setSessionLoading(true);
            const { data } = await authClient.getSession();

            if (!data || !data.user) {
                router.push('/unauthorized');
                return;
            }

            if (data.user.role !== 'admin') {
                router.push('/unauthorized');
                return;
            }

            // Set admin status and token
            setIsAdmin(true);
            setToken(data.session?.token);
            setSessionLoading(false);

            // After confirming admin status, fetch stats
            fetchStats();
        } catch (error) {
            console.error('Error getting session:', error);
            setSessionError(true);
            setSessionLoading(false);
        }
    };

    useEffect(() => {
        getSession();
    }, [router]);

    const filterData = <T extends Record<string, any>>(data: T[], query: string, statusFilter: string): T[] => {
        return data.filter(item => {
            const matchesQuery = Object.values(item).some(
                value => String(value).toLowerCase().includes(query.toLowerCase())
            );
            const matchesStatus = statusFilter === "all" || (item as any).status === statusFilter;
            return matchesQuery && matchesStatus;
        });
    };

    // Get paginated data
    const getPaginatedData = <T extends Record<string, any>>(data: T[], page: number, itemsPerPage: number): T[] => {
        const startIndex = (page - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const filteredToilets = filterData(toiletsData, searchQuery, statusFilter);
    const filteredPictures = filterData(picturesData, searchQuery, statusFilter);
    const filteredUsers = filterData(usersData, searchQuery, "all");
    const filteredReviews = filterData(reviewsData, searchQuery, statusFilter);

    // Get current page data
    const currentReviews = getPaginatedData(filteredReviews, currentPage, itemsPerPage);
    const currentPictures = getPaginatedData(filteredPictures, currentPage, itemsPerPage);
    const currentUsers = getPaginatedData(filteredUsers, currentPage, itemsPerPage);

    // Calculate total pages for current active tab
    const totalPages = {
        toilets: Math.max(Math.ceil(stats.totalToilets / itemsPerPage), currentPage),
        pictures: Math.ceil(filteredPictures.length / itemsPerPage),
        users: Math.ceil(filteredUsers.length / itemsPerPage)
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchStats(page); // Fetch data for the selected page
    };

    useEffect(() => {
        fetchStats(1); // Start with page 1
    }, []);

    useEffect(() => {
        if (activeTab) {
            setCurrentPage(1);
            fetchStats(1);
        }
    }, [activeTab, statusFilter, searchQuery]);

    // Show loading or error states for session
    if (sessionLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-800">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    if (sessionError) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>
                        There was a problem verifying your admin access. Please try logging in again.
                        <div className="mt-4">
                            <Button onClick={() => router.push('/')} className="bg-amber-500 hover:bg-amber-600 text-white">
                                Go to Login
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Only render dashboard if user is admin
    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard <span className="text-amber-500">•</span></h1>
                    <p className="text-gray-600">Manage your <span className="text-amber-500 font-medium">PeeBuddy</span> platform</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-gray-800 flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Total Toilets
                                </CardTitle>
                                <div className="bg-amber-500/10 p-2 rounded-full">
                                    <MapPin className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <CardDescription className="text-gray-700/70">
                                All registered toilets in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-4xl font-bold text-gray-800">
                                {isLoading ? "..." : stats.totalToilets.toLocaleString()}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge className="bg-amber-100 hover:bg-amber-200 text-amber-800">
                                    {isLoading ? "..." : stats.verifiedToilets.toLocaleString()} verified
                                </Badge>
                                <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-800">
                                    {isLoading ? "..." : stats.verificationRate.toFixed(1)}% verification rate
                                </Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-gray-100 text-sm text-gray-500">
                            Updated {isLoading ? "loading..." : "today at " + new Date().toLocaleTimeString()}
                        </CardFooter>
                    </Card>

                    {/* Total Users Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-gray-800 flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Total Users
                                </CardTitle>
                                <div className="bg-amber-500/10 p-2 rounded-full">
                                    <Users className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <CardDescription className="text-gray-700/70">
                                Registered users on the platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-4xl font-bold text-gray-800">
                                {isLoading ? "..." : stats.totalUsers.toLocaleString()}
                            </div>
                            <div className="mt-2 flex items-center">
                                <span className="text-gray-700 text-sm">
                                    Active community of contributors
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-gray-100 text-sm text-gray-500">
                            Updated {isLoading ? "loading..." : "today at " + new Date().toLocaleTimeString()}
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-gray-800 flex items-center gap-2">
                                    <CalendarPlus className="h-5 w-5" />
                                    New Toilets
                                </CardTitle>
                                <div className="bg-amber-500/10 p-2 rounded-full">
                                    <CalendarPlus className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <CardDescription className="text-gray-700/70">
                                Recently added in the past month
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-4xl font-bold text-gray-800">
                                {isLoading ? "..." : stats.newToilets.toLocaleString()}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge className="bg-amber-100 hover:bg-amber-200 text-amber-800">
                                    {stats.timeRange}
                                </Badge>
                                <Badge className="bg-green-100 hover:bg-green-100 text-green-800">
                                    {isLoading ? "..." : stats.averageRating.toFixed(1)} avg rating
                                </Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-gray-100 text-sm text-gray-500">
                            Updated {isLoading ? "loading..." : "today at " + new Date().toLocaleTimeString()}
                        </CardFooter>
                    </Card>
                </div>

                <div className="bg-white text-black rounded-xl border border-gray-200 shadow-md overflow-hidden ring-1 ring-amber-100">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Data Management</h2>

                            {/* Search and Filters */}
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-8 bg-gray-50 border-gray-200 focus-visible:ring-amber-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-amber-500" />
                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                    >
                                        <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 focus:ring-amber-500">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black cursor-pointer">
                                            <SelectItem className="cursor-pointer hover:bg-gray-100" value="all">All Statuses</SelectItem>
                                            <SelectItem className="cursor-pointer hover:bg-gray-100" value="verified">Verified</SelectItem>
                                            <SelectItem className="cursor-pointer hover:bg-gray-100" value="pending">Pending</SelectItem>
                                            <SelectItem className="cursor-pointer hover:bg-gray-100" value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="toilets" className="w-full" onValueChange={setActiveTab}>
                        <div className="border-b border-gray-200">
                            <TabsList className="bg-gray-50 p-0 w-full flex h-12 rounded-none">
                                <TabsTrigger
                                    value="toilets"
                                    className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Toilets
                                </TabsTrigger>
                                <TabsTrigger
                                    value="pictures"
                                    className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
                                >
                                    <Image className="mr-2 h-4 w-4" />
                                    Pictures
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reviews"
                                    className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
                                >
                                    <Star className="mr-2 h-4 w-4" />
                                    Reviews
                                </TabsTrigger>
                                <TabsTrigger
                                    value="users"
                                    className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Users
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Toilets Tab */}
                        <TabsContent value="toilets" className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 hover:bg-gray-50">
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Added Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                    Loading toilet data...
                                                </TableCell>
                                            </TableRow>
                                        ) : hasError ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-red-500">
                                                    Error loading data. Please try again.
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredToilets.length > 0 ? (
                                            filteredToilets.map((toilet) => (
                                                <TableRow key={toilet.id}>
                                                    <TableCell className="font-medium">{toilet.id}</TableCell>
                                                    <TableCell>{toilet.name}</TableCell>
                                                    <TableCell>{toilet.location}</TableCell>
                                                    <TableCell>
                                                        <Badge className={
                                                            toilet.status === "verified" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                                                                toilet.status === "pending" ? "bg-gray-100 text-amber-800 hover:bg-amber-50" :
                                                                    "bg-red-100 text-red-800 hover:bg-red-200"
                                                        }>
                                                            {toilet.status.charAt(0).toUpperCase() + toilet.status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{toilet.addedDate}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button title="Will be implemented" size="sm" variant="ghost" className="h-8 w-8 p-0 hover:cursor-not-allowed">
                                                                <Eye className="h-4 w-4 text-gray-300/50" />
                                                            </Button>
                                                            {toilet.status === "pending" && (
                                                                <>
                                                                    <Button title="Verify the toilet" size="sm" variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer hover:text-amber-600" onClick={() => handleVerifyToilet(toilet.id)}>
                                                                        <Check className="h-4 w-4 text-amber-600" />
                                                                    </Button>
                                                                    <Button title="Delete the toilet" size="sm" variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer hover:text-red-600" onClick={() => handleDeleteToilet(toilet.id)}>
                                                                        <Trash className="h-4 w-4 text-red-600" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {toilet.status === "verified" && (
                                                                <Button title="Unverify the toilet" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleUnverifyToilet(toilet.id)}>
                                                                    <X className="h-4 w-4 text-red-600" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                    No toilets found matching your criteria
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <div className="flex justify-center items-center p-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="border-gray-200 hover:bg-amber-50 text-gray-700 hover:text-amber-700"
                                        >
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {(() => {
                                                const maxPages = 10;
                                                const halfMaxPages = Math.floor(maxPages / 2);
                                                let startPage = Math.max(1, currentPage - halfMaxPages);
                                                let endPage = Math.min(totalPages.toilets, startPage + maxPages - 1);

                                                // Adjust start if we hit the end limit
                                                if (endPage - startPage + 1 < maxPages) {
                                                    startPage = Math.max(1, endPage - maxPages + 1);
                                                }

                                                return Array.from(
                                                    { length: endPage - startPage + 1 },
                                                    (_, i) => startPage + i
                                                ).map((page) => (
                                                    <Button
                                                        key={page}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handlePageChange(page)}
                                                        className={currentPage === page ?
                                                            "bg-amber-500 hover:bg-amber-600" :
                                                            "border-gray-200 hover:bg-gray-100"}
                                                    >
                                                        {page}
                                                    </Button>
                                                ));
                                            })()}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!stats.hasMoreToilets}
                                            className="border-gray-200 hover:bg-amber-50 text-gray-700 hover:text-amber-700"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    <div className="text-sm text-gray-500 ml-4">
                                        Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredToilets.length)} of {stats.totalToilets}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Review Tabs */}
                        <TabsContent value="reviews" className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 hover:bg-gray-50">
                                            <TableHead>ID</TableHead>
                                            <TableHead>Toilet ID</TableHead>
                                            <TableHead>Upload Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                    Loading review data...
                                                </TableCell>
                                            </TableRow>
                                        ) : hasError ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-red-500">
                                                    Error loading data. Please try again.
                                                </TableCell>
                                            </TableRow>
                                        ) : currentReviews.length > 0 ? (
                                            currentReviews.map((review) => (
                                                <TableRow key={review.id} className="hover:bg-gray-50">
                                                    <TableCell>{review.id}</TableCell>
                                                    <TableCell>{review.toiletId}</TableCell>
                                                    <TableCell>{review.createdAt}</TableCell>
                                                    <TableCell>
                                                        <Badge className={
                                                            review.status === "verified" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                                                                review.status === "pending" ? "bg-gray-100 text-amber-800 hover:bg-amber-50" :
                                                                    "bg-red-100 text-red-800 hover:bg-red-200"
                                                        }>
                                                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:cursor-not-allowed">
                                                                <Eye className="h-4 w-4 text-gray-300/50" />
                                                            </Button>
                                                            {
                                                                review.status === "pending" ? (
                                                                    <>
                                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleVerifyReview(review.id)}>
                                                                            <Check className="h-4 w-4 text-amber-600" />
                                                                        </Button>
                                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDeleteReview(review.id)}>
                                                                            <X className="h-4 w-4 text-red-600" />
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleUnverifyReview(review.id)}>
                                                                        <X className="h-4 w-4 text-red-600" />
                                                                    </Button>
                                                                )
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                    No reviews found matching your criteria
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        {/* Pictures Tab */}
                        <TabsContent value="pictures" className="p-0">
                            <div className="flex justify-center items-center h-full py-12">
                                Will be implemented in v2 ❣️
                            </div>
                        </TabsContent>

                        <TabsContent value="users" className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 hover:bg-gray-50">
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                    Loading user data...
                                                </TableCell>
                                            </TableRow>
                                        ) : hasError ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-red-500">
                                                    Error loading data. Please try again.
                                                </TableCell>
                                            </TableRow>
                                        ) : currentUsers.length > 0 ? (
                                            currentUsers.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.id}</TableCell>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.role}</TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-gray-100 text-amber-800 hover:bg-amber-50">
                                                            {user.contributions}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            user.role === "user" ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Button title="Promote to admin" size="sm" variant="ghost" className="h-8 hover:bg-green-200 transition-colors duration-200 w-8 p-0" onClick={() => handlePromote(user.id)}>
                                                                        <ArrowUp className="h-4 w-4 text-gray-600" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Button title="Demote to user" size="sm" variant="ghost" className="h-8 hover:bg-red-200 transition-colors duration-200 w-8 p-0" onClick={() => handleDemote(user.id)}>
                                                                        <ArrowDown className="h-4 w-4 text-gray-600" />
                                                                    </Button>
                                                                </div>
                                                            )
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                    No users found matching your criteria
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                {filteredUsers.length > itemsPerPage && (
                                    <div className="flex justify-center items-center p-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="border-gray-200 hover:bg-amber-50 text-gray-700 hover:text-amber-700"
                                            >
                                                Previous
                                            </Button>

                                            <div className="flex items-center gap-1">
                                                {(() => {
                                                    // Show max 10 pages with current page in the middle when possible
                                                    const maxPages = 10;
                                                    const halfMaxPages = Math.floor(maxPages / 2);
                                                    let startPage = Math.max(1, currentPage - halfMaxPages);
                                                    let endPage = Math.min(totalPages.users, startPage + maxPages - 1);

                                                    // Adjust start if we hit the end limit
                                                    if (endPage - startPage + 1 < maxPages) {
                                                        startPage = Math.max(1, endPage - maxPages + 1);
                                                    }

                                                    return Array.from(
                                                        { length: endPage - startPage + 1 },
                                                        (_, i) => startPage + i
                                                    ).map((page) => (
                                                        <Button
                                                            key={page}
                                                            variant={currentPage === page ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => handlePageChange(page)}
                                                            className={currentPage === page ?
                                                                "bg-amber-500 hover:bg-amber-600" :
                                                                "border-gray-200 hover:bg-gray-100"}
                                                        >
                                                            {page}
                                                        </Button>
                                                    ));
                                                })()}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages.users}
                                                className="border-gray-200 hover:bg-amber-50 text-gray-700 hover:text-amber-700"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                        <div className="text-sm text-gray-500 ml-4">
                                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}