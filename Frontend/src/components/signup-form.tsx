import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiService } from "@/services/api"
import { useState } from "react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    city: '',
    country: '',
    additional_info: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await apiService.createUser(formData);
      setMessage({ type: 'success', text: 'Account created successfully! Welcome to GlobeTrotter!' });
      
      // Reset form
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        city: '',
        country: '',
        additional_info: ''
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-card rounded-lg border p-8 shadow-lg">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Photo</span>
          </div>
          <h1 className="text-2xl font-bold">Registration Screen (Screen 2)</h1>
        </div>
        
        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={cn("space-y-6", className)} {...props}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input 
                id="firstname"
                name="firstname"
                type="text" 
                placeholder="First Name" 
                value={formData.firstname}
                onChange={handleInputChange}
                required 
                className="bg-background border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input 
                id="lastname"
                name="lastname"
                type="text" 
                placeholder="Last Name" 
                value={formData.lastname}
                onChange={handleInputChange}
                required 
                className="bg-background border-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                type="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleInputChange}
                required 
                className="bg-background border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Phone Number</Label>
              <Input 
                id="contact"
                name="contact"
                type="tel" 
                placeholder="Phone Number" 
                value={formData.contact}
                onChange={handleInputChange}
                required 
                className="bg-background border-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city"
                name="city"
                type="text" 
                placeholder="City" 
                value={formData.city}
                onChange={handleInputChange}
                className="bg-background border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country"
                name="country"
                type="text" 
                placeholder="Country" 
                value={formData.country}
                onChange={handleInputChange}
                className="bg-background border-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_info">Additional Information</Label>
            <Textarea 
              id="additional_info"
              name="additional_info"
              placeholder="Additional Information" 
              value={formData.additional_info}
              onChange={handleInputChange}
              className="min-h-[120px] bg-background border-2 resize-none"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register Users'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
