'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  CircleUser,
  ChevronDown,
  ChevronRight,
  X,
  Calendar,
  Car,
  UtensilsCrossed,
  PersonStanding,
  UserRoundPlus,
  Headphones,
  Settings,
  CreditCard,
  House,
  UserRoundCog,
  MessageCircleQuestion,
  Users,
  TextSearch,
} from 'lucide-react';
import {
  LibraryIcon,
  TripIcon,
} from '@/components/library/SvgComponents/Icons';
import { useState, useEffect } from 'react';
import { LogoutButton } from '../common/LogoutButton';

type NavItem = {
  label: string;
  href?: string;
  icon: React.ComponentType<any>;
  boxedPlus?: boolean;
  children?: NavItem[];
};

const nav: NavItem[] = [
  { label: 'Dashboard', href: '/organizer/dashboard', icon: LayoutGrid },
  {
    label: 'Organizer Profile',
    href: '/organizer/profile',
    icon: CircleUser,
  },
  { label: 'Trip', href: '/organizer/trip-overview', icon: TripIcon },
  {
    label: 'Library',
    href: '/organizer/library',
    icon: LibraryIcon,
    children: [
      {
        label: 'Day Description',
        href: '/organizer/library/events',
        icon: Calendar,
      },
      { label: 'Transit', href: '/organizer/library/transits', icon: Car },
      { label: 'Stays', href: '/organizer/library/stays', icon: House },

      {
        label: 'Meals',
        href: '/organizer/library/meals',
        icon: UtensilsCrossed,
      },
      {
        label: 'Activities',
        href: '/organizer/library/activities',
        icon: PersonStanding,
      },
      {
        label: 'Trip Leaders',
        href: '/organizer/library/trip-leaders',
        icon: UserRoundCog,
      },
      {
        label: 'FAQs',
        href: '/organizer/library/faqs',
        icon: MessageCircleQuestion,
      },
    ],
  },
  { label: 'Team Members', href: '/organizer/team', icon: UserRoundPlus },
  { label: 'Support Center', href: '/organizer/support', icon: Headphones },
  { label: 'Leads', href: '/organizer/leads/all', icon: Users },
  { label: 'Queries', href: '/organizer/queries/all', icon: TextSearch },
  { label: 'Billing', href: '/organizer/billing', icon: CreditCard },
  { label: 'Settings', href: '/organizer/settings', icon: Settings },
];

type OrganizerSidebarProps = {
  showLogo?: boolean;
  isOpen?: boolean; // for mobile
  onClose?: () => void;
};

export function OrganizerSidebar({
  showLogo = true,
  isOpen,
  onClose,
}: OrganizerSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({
    ['Library']: false,
  });

  const isActive = (href?: string) =>
    href
      ? href === '/organizer'
        ? pathname === href
        : pathname.startsWith(href)
      : false;

  useEffect(() => {
    nav.forEach((item) => {
      if (item.children?.some((child) => isActive(child.href))) {
        setOpen((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  const toggle = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-40 md:hidden'
          onClick={onClose}
        />
      )}

      <aside
        className={`bg-[#F3F3F3] fixed md:static top-0 left-0 z-50 min-h-screen md:w-[18.2%] max-w-[320px] border-r border-gray-200 flex flex-col transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Mobile close button */}
        <div className='flex items-center justify-between p-4 md:hidden'>
          {showLogo && <img src='/logo.png' alt='Ragir' className='h-8' />}
          <button
            onClick={onClose}
            className='p-2 rounded-md hover:bg-gray-100'
          >
            <X className='w-6 h-6 text-gray-600' />
          </button>
        </div>

        {/* Logo (desktop) */}
        {showLogo && (
          <div className='hidden md:block p-6 border-b border-gray-100'>
            <img src='/logo.png' alt='Ragir' className='h-8' />
          </div>
        )}

        {/* Navigation */}
        <nav className='p-3 space-y-3 overflow-y-auto'>
          {nav.map(({ label, href, icon: Icon, children }) => {
            const active = isActive(href);
            const hasChildren = !!children;

            return (
              <div key={label}>
                <div
                  onClick={() => {
                    if (hasChildren) {
                      toggle(label);
                    }
                  }}
                  className={[
                    'flex items-center justify-between rounded-[8px] cursor-pointer select-none',
                    active
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {/* Label Section */}
                  {hasChildren ? (
                    <div className='flex flex-1 items-center gap-3 px-4 py-3'>
                      <Icon
                        className={[
                          'w-5 h-5',
                          active ? 'text-white' : 'text-gray-700',
                        ].join(' ')}
                      />
                      <span className='font-medium text-[1rem]'>{label}</span>
                    </div>
                  ) : (
                    <Link
                      href={href || '#'}
                      className='group relative flex flex-1 items-center gap-3 rounded-lg px-4 py-3 transition-all'
                    >
                      <Icon
                        className={[
                          'w-5 h-5',
                          active
                            ? 'text-white'
                            : 'text-gray-700 group-hover:text-gray-900',
                        ].join(' ')}
                      />
                      <span className='font-medium text-[1rem]'>{label}</span>
                    </Link>
                  )}

                  {/* Chevron for expandable items */}
                  {hasChildren && (
                    <div className='pr-3 transition-transform duration-200'>
                      {open[label] ? (
                        <ChevronDown
                          className={`w-5 h-5 ${
                            active ? 'text-white' : 'text-gray-700'
                          }`}
                        />
                      ) : (
                        <ChevronRight
                          className={`w-5 h-5 ${
                            active ? 'text-white' : 'text-gray-700'
                          }`}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu Section */}
                {hasChildren && open[label] && (
                  <div className='bg-gray-100 rounded-[8px] mt-1'>
                    <div className='mx-2 py-2 space-y-2'>
                      {children.map(({ label, href, icon: ChildIcon }) => {
                        const childActive = isActive(href);
                        return (
                          <Link
                            key={href}
                            href={href || '#'}
                            className={[
                              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                              childActive
                                ? 'bg-gray-50 text-gray-900 font-medium'
                                : 'text-gray-600 hover:bg-gray-50',
                            ].join(' ')}
                          >
                            <ChildIcon className='w-4 h-4' />
                            <span>{label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className='mt-auto p-6'>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
