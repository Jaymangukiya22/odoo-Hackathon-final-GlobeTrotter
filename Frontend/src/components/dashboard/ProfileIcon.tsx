import { Button } from "@/components/ui/button";
import { useState } from "react";

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleProfile = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleProfile}
        aria-label="User profile"
        className="rounded-full"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          JD
        </div>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">john@example.com</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <button className="w-full text-left py-2 text-sm hover:bg-gray-100 rounded">
              My Profile
            </button>
            <button className="w-full text-left py-2 text-sm hover:bg-gray-100 rounded">
              Settings
            </button>
            <button className="w-full text-left py-2 text-sm hover:bg-gray-100 rounded">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
