import Link from "next/link";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PhosphorIcon } from "@/lib/icons";

/**
 * Base Empty State Component
 * Displays a friendly message when no content is available
 */
interface EmptyStateProps {
  icon?: PhosphorIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
  size = "md",
}: EmptyStateProps) {
  const sizes = {
    sm: {
      container: "py-8",
      icon: 40,
      title: "text-lg",
      description: "text-sm",
    },
    md: {
      container: "py-12",
      icon: 56,
      title: "text-xl",
      description: "text-base",
    },
    lg: {
      container: "py-16",
      icon: 72,
      title: "text-2xl",
      description: "text-lg",
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeConfig.container,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      {Icon && (
        <div
          className={cn(
            "mb-4 rounded-full bg-gray-100 p-4",
            iconClassName
          )}
        >
          <Icon
            size={sizeConfig.icon}
            weight="duotone"
            className="text-gray-400"
          />
        </div>
      )}

      {/* Title */}
      <h3 className={cn("font-bold text-gray-900 mb-2", sizeConfig.title)}>
        {title}
      </h3>

      {/* Description */}
      <p className={cn("text-gray-600 max-w-md mb-6", sizeConfig.description)}>
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <>
          {action.href ? (
            <Button asChild variant={action.variant || "default"} size="lg">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              size="lg"
            >
              {action.label}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Empty Wishlist State
 */
export function EmptyWishlist() {
  return (
    <EmptyState
      icon={Icons.heart}
      title="Wishlist Anda Masih Kosong"
      description="Mulai tambahkan destinasi favorit Anda untuk merencanakan perjalanan impian ke Bali"
      action={{
        label: "Jelajahi Destinasi",
        href: "/destinations",
      }}
      iconClassName="bg-pink-50"
    />
  );
}

/**
 * No Search Results State
 */
interface EmptySearchResultsProps {
  searchQuery?: string;
  onClearFilters?: () => void;
}

export function EmptySearchResults({
  searchQuery,
  onClearFilters,
}: EmptySearchResultsProps) {
  return (
    <EmptyState
      icon={Icons.search}
      title="Tidak Ada Hasil Ditemukan"
      description={
        searchQuery
          ? `Pencarian "${searchQuery}" tidak menemukan hasil. Coba kata kunci lain atau hapus beberapa filter.`
          : "Tidak ada hasil yang sesuai dengan filter Anda. Coba sesuaikan kriteria pencarian."
      }
      action={
        onClearFilters
          ? {
              label: "Hapus Semua Filter",
              onClick: onClearFilters,
              variant: "outline",
            }
          : undefined
      }
      iconClassName="bg-blue-50"
    />
  );
}

/**
 * No Bookings State
 */
export function EmptyBookings() {
  return (
    <EmptyState
      icon={Icons.ticket}
      title="Belum Ada Pemesanan"
      description="Anda belum memiliki pemesanan aktif. Mulai petualangan Bali Anda dengan memesan paket wisata favorit!"
      action={{
        label: "Lihat Paket Wisata",
        href: "/tours",
      }}
      iconClassName="bg-sky-50"
    />
  );
}

/**
 * No Reviews State
 */
export function EmptyReviews() {
  return (
    <EmptyState
      icon={Icons.star}
      title="Belum Ada Ulasan"
      description="Jadilah yang pertama berbagi pengalaman Anda dan membantu wisatawan lain membuat keputusan."
      size="sm"
      iconClassName="bg-amber-50"
    />
  );
}

/**
 * Empty Cart State
 */
export function EmptyCart() {
  return (
    <EmptyState
      icon={Icons.package}
      title="Keranjang Anda Kosong"
      description="Belum ada paket wisata di keranjang. Jelajahi destinasi menakjubkan di Bali dan tambahkan ke keranjang."
      action={{
        label: "Mulai Belanja",
        href: "/tours",
      }}
      iconClassName="bg-green-50"
    />
  );
}

/**
 * No Notifications State
 */
export function EmptyNotifications() {
  return (
    <EmptyState
      icon={Icons.bell}
      title="Tidak Ada Notifikasi"
      description="Anda sudah up-to-date! Tidak ada notifikasi baru saat ini."
      size="sm"
      iconClassName="bg-purple-50"
    />
  );
}

/**
 * Error State (Generic)
 */
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  description = "Maaf, terjadi kesalahan saat memuat data. Silakan coba lagi.",
  onRetry,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={Icons.warning}
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: "Coba Lagi",
              onClick: onRetry,
              variant: "outline",
            }
          : undefined
      }
      iconClassName="bg-red-50"
    />
  );
}

/**
 * No Internet Connection State
 */
export function OfflineState() {
  return (
    <EmptyState
      icon={Icons.offline}
      title="Tidak Ada Koneksi Internet"
      description="Sepertinya Anda sedang offline. Periksa koneksi internet Anda dan coba lagi."
      action={{
        label: "Coba Lagi",
        onClick: () => window.location.reload(),
        variant: "outline",
      }}
      iconClassName="bg-orange-50"
    />
  );
}

/**
 * Coming Soon State
 */
interface ComingSoonStateProps {
  feature: string;
}

export function ComingSoonState({ feature }: ComingSoonStateProps) {
  return (
    <EmptyState
      icon={Icons.clock}
      title="Segera Hadir"
      description={`Fitur ${feature} sedang dalam pengembangan dan akan segera tersedia. Nantikan update menarik dari kami!`}
      iconClassName="bg-indigo-50"
    />
  );
}

/**
 * Access Denied State
 */
export function AccessDeniedState() {
  return (
    <EmptyState
      icon={Icons.lock}
      title="Akses Ditolak"
      description="Anda tidak memiliki izin untuk mengakses halaman ini. Silakan login atau hubungi administrator."
      action={{
        label: "Kembali ke Beranda",
        href: "/",
        variant: "outline",
      }}
      iconClassName="bg-red-50"
    />
  );
}

/**
 * Empty Destinations State
 */
export function EmptyDestinations() {
  return (
    <EmptyState
      icon={Icons.explore}
      title="Tidak Ada Destinasi"
      description="Belum ada destinasi wisata yang tersedia saat ini. Periksa kembali nanti untuk update terbaru!"
      iconClassName="bg-teal-50"
    />
  );
}

/**
 * Empty Tours State
 */
export function EmptyTours() {
  return (
    <EmptyState
      icon={Icons.compass}
      title="Tidak Ada Paket Wisata"
      description="Belum ada paket wisata yang tersedia untuk destinasi ini. Jelajahi destinasi lain atau kembali lagi nanti."
      action={{
        label: "Lihat Semua Destinasi",
        href: "/destinations",
      }}
      iconClassName="bg-cyan-50"
    />
  );
}
