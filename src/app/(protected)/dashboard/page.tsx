import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administrative control panel",
};

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome to the Admin Panel</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Contact Messages"
          description="Manage messages received through the contact form"
          link="/contact-messages"
        />
        <DashboardCard 
          title="Waiting List"
          description="Manage demo requests and waiting list"
          link="/waiting-list"
        />
        <DashboardCard 
          title="News"
          description="Manage and publish news on the website"
          link="/news"
        />
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  description, 
  link 
}: { 
  title: string; 
  description: string; 
  link: string 
}) {
  return (
    <Link href={`/dashboard${link}`} className="block">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
          Manage &rarr;
        </span>
      </div>
    </Link>
  );
} 