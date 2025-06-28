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
import { MapPin, Users, CalendarPlus, Search, Filter, Eye, Check, X, Image, RefreshCw, Trash } from "lucide-react";
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

interface UserData {
    id: number;
    name: string;
    email: string;
    joinDate: string;
    contributions: number;
    role: string;
}

interface StatsData {
    totalToilets: number;
    verifiedToilets: number;
    totalUsers: number;
    newToilets: number;
    timeRange: string;
    averageRating: number;
    totalPictures: number;
    verificationRate: number;
    freeToilets: number;
    publicToilets: number;
    handicapToilets: number;
    commerceToilets: number;
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

    const [token, setToken] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [sessionLoading, setSessionLoading] = useState<boolean>(true);
    const [sessionError, setSessionError] = useState<boolean>(false);
    const router = useRouter();
    const [stats, setStats] = useState<StatsData>({
        totalToilets: 0,
        verifiedToilets: 0,
        totalUsers: 0,
        newToilets: 0,
        timeRange: "monthly",
        averageRating: 0,
        totalPictures: 0,
        verificationRate: 0,
        freeToilets: 0,
        publicToilets: 0,
        handicapToilets: 0,
        commerceToilets: 0
    });


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
            const data = await response.json();
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleVerifyToilet = async (toiletId: number) => {
        try {
            const response = await fetch(`/api/toilets/${toiletId}/verify`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
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

    const handleUnverifyToilet = async (toiletId: number) => {
        try {
            const response = await fetch(`/api/toilets/${toiletId}/unverify`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
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

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            setHasError(false);
            
            const response = await fetch('/api/stats');
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            // {toilets: {total: 10, verified: {total: 5}, byType: {free: 2, public: 3, handicap: 1, commerce: 4}}}
            setStats({
                totalToilets: data.toilets.total,
                verifiedToilets: data.toilets.verified.total,
                totalUsers: data.users.total,
                newToilets: data.toilets.total - data.toilets.verified.total,
                timeRange: "monthly",
                averageRating: data.reviews.averageRating,
                totalPictures: data.pictures.total,
                verificationRate: data.toilets.verificationRate,
                freeToilets: data.toilets.byType.free.length,
                publicToilets: data.toilets.byType.public.length,
                handicapToilets: data.toilets.byType.handicap.length,
                commerceToilets: data.toilets.byType.commerce.length
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
                status: picture.is_verified ? "approved" : "pending"
            }));
            setPicturesData(transformedPictures);
            
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
    
    const filteredToilets = filterData(toiletsData, searchQuery, statusFilter);
    const filteredPictures = filterData(picturesData, searchQuery, statusFilter);
    const filteredUsers = filterData(usersData, searchQuery, "all");
    // Show loading or error states for session
    if (sessionLoading) {
        return (
            <div className="min-h-screen bg-amber-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
                    <p className="mt-4 text-amber-800">Verifying admin access...</p>
                </div>
            </div>
        );
    }
    
    if (sessionError) {
        return (
            <div className="min-h-screen bg-amber-50 p-6 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>
                        There was a problem verifying your admin access. Please try logging in again.
                        <div className="mt-4">
                            <Button onClick={() => router.push('/')}>Go to Login</Button>
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
        <div className="min-h-screen bg-amber-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your PeeBuddy platform</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-amber-200 text-black shadow-md hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="bg-amber-100 border-b border-amber-200 pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-amber-800 flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Total Toilets
                                </CardTitle>
                                <div className="bg-amber-500/10 p-2 rounded-full">
                                    <MapPin className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <CardDescription className="text-amber-700/70">
                                All registered toilets in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-4xl font-bold text-gray-800">
                                {isLoading ? "..." : stats.totalToilets.toLocaleString()}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge className="bg-amber-300 hover:bg-amber-300 text-amber-800">
                                    {isLoading ? "..." : stats.verifiedToilets.toLocaleString()} verified
                                </Badge>
                                <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-800">
                                    {isLoading ? "..." : stats.verificationRate.toFixed(1)}% verification rate
                                </Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-amber-100 text-sm text-gray-500">
                            Updated {isLoading ? "loading..." : "today at " + new Date().toLocaleTimeString()}
                        </CardFooter>
                    </Card>

                            {/* Total Users Card */}
                    <Card className="border-amber-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="bg-amber-100 border-b border-amber-200 pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-amber-800 flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Total Users
                                </CardTitle>
                                <div className="bg-amber-500/10 p-2 rounded-full">
                                    <Users className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <CardDescription className="text-amber-700/70">
                                Registered users on the platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-4xl font-bold text-gray-800">
                                {isLoading ? "..." : stats.totalUsers.toLocaleString()}
                            </div>
                            <div className="mt-2 flex items-center">
                                <span className="text-amber-700 text-sm">
                                    Active community of contributors
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-amber-100 text-sm text-gray-500">
                            Updated {isLoading ? "loading..." : "today at " + new Date().toLocaleTimeString()}
                        </CardFooter>
                    </Card>

                    <Card className="border-amber-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="bg-amber-100 border-b border-amber-200 pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-amber-800 flex items-center gap-2">
                                    <CalendarPlus className="h-5 w-5" />
                                    New Toilets
                                </CardTitle>
                                <div className="bg-amber-500/10 p-2 rounded-full">
                                    <CalendarPlus className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <CardDescription className="text-amber-700/70">
                                Recently added in the past month
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-4xl font-bold text-gray-800">
                                {isLoading ? "..." : stats.newToilets.toLocaleString()}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge className="bg-amber-300 hover:bg-amber-300 text-amber-800">
                                    {stats.timeRange}
                                </Badge>
                                <Badge className="bg-green-100 hover:bg-green-100 text-green-800">
                                    {isLoading ? "..." : stats.averageRating.toFixed(1)} avg rating
                                </Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-amber-100 text-sm text-gray-500">
                            Updated {isLoading ? "loading..." : "today at " + new Date().toLocaleTimeString()}
                        </CardFooter>
                    </Card>
                </div>
                
                <div className="bg-white text-black rounded-xl border border-amber-200 shadow-md overflow-hidden">
                    <div className="p-6 border-b border-amber-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Data Management</h2>
                            
                            {/* Search and Filters */}
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-8 bg-amber-50 border-amber-200 focus-visible:ring-amber-500"
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
                                        <SelectTrigger className="w-[180px] bg-amber-50 border-amber-200 focus:ring-amber-500">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-amber-50 text-black cursor-pointer">
                                            <SelectItem className="cursor-pointer hover:bg-amber-100" value="all">All Statuses</SelectItem>
                                            <SelectItem className="cursor-pointer hover:bg-amber-100" value="verified">Verified</SelectItem>
                                            <SelectItem className="cursor-pointer hover:bg-amber-100" value="pending">Pending</SelectItem>
                                            <SelectItem className="cursor-pointer hover:bg-amber-100" value="rejected">Rejected</SelectItem>
                                            <SelectItem className="cursor-pointer hover:bg-amber-100" value="approved">Approved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <Tabs defaultValue="toilets" className="w-full" onValueChange={setActiveTab}>
                        <div className="border-b border-amber-200">
                            <TabsList className="bg-amber-50 p-0 w-full flex h-12 rounded-none">
                                <TabsTrigger 
                                    value="toilets" 
                                    className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:text-amber-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Toilets
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="pictures" 
                                    className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:text-amber-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
                                >
                                    <Image className="mr-2 h-4 w-4" />
                                    Pictures to Verify
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="users" 
                                    className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:text-amber-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
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
                                        <TableRow className="bg-amber-50/50 hover:bg-amber-50">
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
                                                            toilet.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                                                            "bg-red-100 text-red-800 hover:bg-red-200"
                                                        }>
                                                            {toilet.status.charAt(0).toUpperCase() + toilet.status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{toilet.addedDate}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button title="View the toilet" size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                <Eye className="h-4 w-4 text-amber-600" />
                                                            </Button>
                                                            {toilet.status === "pending" && (
                                                                <>
                                                                <Button title="Verify the toilet" size="sm" variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer hover:text-green-600" onClick={() => handleVerifyToilet(toilet.id)}>
                                                                    <Check className="h-4 w-4 text-green-600" />
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
                            </div>
                        </TabsContent>
                        
                        {/* Pictures Tab */}
                        <TabsContent value="pictures" className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-amber-50/50 hover:bg-amber-50">
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
                                                    Loading picture data...
                                                </TableCell>
                                            </TableRow>
                                        ) : hasError ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-red-500">
                                                    Error loading data. Please try again.
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredPictures.length > 0 ? (
                                            filteredPictures.map((picture) => (
                                                <TableRow key={picture.id}>
                                                    <TableCell className="font-medium">{picture.id}</TableCell>
                                                    <TableCell>{picture.toiletId}</TableCell>
                                                    <TableCell>{picture.uploadDate}</TableCell>
                                                    <TableCell>
                                                        <Badge className={
                                                            picture.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                                                            picture.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                                                            "bg-red-100 text-red-800 hover:bg-red-200"
                                                        }>
                                                            {picture.status.charAt(0).toUpperCase() + picture.status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                <Eye className="h-4 w-4 text-amber-600" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                <Check className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                <X className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                    No pictures found matching your criteria
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="users" className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-amber-50/50 hover:bg-amber-50">
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
                                        ) : filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.id}</TableCell>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.role}</TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                                            {user.contributions}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                <Eye className="h-4 w-4 text-amber-600" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                <Eye className="h-4 w-4 text-amber-600" />
                                                            </Button>
                                                        </div>
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
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}