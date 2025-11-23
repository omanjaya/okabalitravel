"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helpers";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // All hooks must be at the top before any conditional returns
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    bio: "",
  });
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailPromotions: true,
    emailNews: false,
    pushBookings: true,
    pushPromotions: false,
  });

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Icons.spinner size={32} className="animate-spin text-sky-600" />
      </div>
    );
  }

  const handleProfileSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Pengaturan</h1>
          <p className="text-gray-600">Kelola informasi akun dan preferensi Anda</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <Icons.user size={18} className="mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security">
              <Icons.shield size={18} className="mr-2" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Icons.bell size={18} className="mr-2" />
              Notifikasi
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                  Perbarui informasi pribadi dan foto profil Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 to-emerald-500 text-white text-2xl">
                      {getInitials(session?.user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Foto Profil</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Icons.image size={16} className="mr-2" />
                        Ubah Foto
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      placeholder="+62 xxx xxxx xxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Lahir</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    placeholder="Ceritakan sedikit tentang diri Anda..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Icons.spinner size={18} className="mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Icons.checkCircle size={18} className="mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Keamanan Akun</CardTitle>
                <CardDescription>
                  Kelola password dan keamanan akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Password Saat Ini</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password Baru</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Icons.spinner size={18} className="mr-2 animate-spin" />
                          Memperbarui...
                        </>
                      ) : (
                        <>
                          <Icons.lock size={18} className="mr-2" />
                          Ubah Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tingkatkan keamanan akun Anda dengan mengaktifkan autentikasi dua faktor
                  </p>
                  <Button variant="outline">
                    <Icons.shield size={18} className="mr-2" />
                    Aktifkan 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Notifikasi</CardTitle>
                <CardDescription>
                  Kelola cara kami menghubungi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Konfirmasi Pemesanan</p>
                        <p className="text-sm text-gray-600">
                          Dapatkan notifikasi tentang pemesanan Anda
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailBookings}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailBookings: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Promosi dan Penawaran</p>
                        <p className="text-sm text-gray-600">
                          Terima penawaran khusus dan diskon
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailPromotions}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailPromotions: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Berita dan Update</p>
                        <p className="text-sm text-gray-600">
                          Dapatkan tips travel dan berita terbaru
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailNews}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailNews: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Pemesanan</p>
                        <p className="text-sm text-gray-600">
                          Notifikasi tentang pemesanan Anda
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushBookings}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, pushBookings: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Promosi</p>
                        <p className="text-sm text-gray-600">
                          Penawaran terbaru langsung ke perangkat Anda
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushPromotions}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, pushPromotions: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button>
                    <Icons.checkCircle size={18} className="mr-2" />
                    Simpan Preferensi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
