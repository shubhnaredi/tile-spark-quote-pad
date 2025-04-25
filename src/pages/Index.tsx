
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Tile Showroom App
          </h1>
          <p className="text-gray-500">
            Welcome, {profile?.name}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            signOut();
            navigate('/login');
          }}
          className="mt-4 md:mt-0"
        >
          Logout
        </Button>
      </div>
      
      <Separator className="my-6" />
      
      {isAdmin() ? <AdminHome /> : <SalesHome />}
    </div>
  );
};

const SalesHome = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Button 
        onClick={() => navigate('/customer/new')} 
        className="h-32 text-xl bg-primary hover:bg-primary-600"
      >
        New Customer
      </Button>
      
      <Button 
        onClick={() => navigate('/customers')}
        variant="outline" 
        className="h-32 text-xl border-2"
      >
        My Customers
      </Button>
    </div>
  );
};

const AdminHome = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Button 
        onClick={() => navigate('/admin/dashboard')} 
        className="h-32 text-xl bg-primary hover:bg-primary-600"
      >
        Dashboard
      </Button>
      
      <Button 
        onClick={() => navigate('/admin/tiles')}
        variant="outline" 
        className="h-32 text-xl border-2"
      >
        Tile Catalog
      </Button>
      
      <Button 
        onClick={() => navigate('/admin/chits')}
        variant="outline" 
        className="h-32 text-xl border-2"
      >
        Measurement Chits
      </Button>
      
      <Button 
        onClick={() => navigate('/customer/new')} 
        className="h-32 text-xl bg-secondary hover:bg-secondary-600"
      >
        New Customer
      </Button>
    </div>
  );
};

export default Index;
