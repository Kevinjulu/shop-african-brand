import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorTable } from "@/components/admin/VendorTable";
import { VendorApplications } from "@/components/admin/vendors/VendorApplications";
import { Card } from "@/components/ui/card";

const VendorsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>
      
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="active">Active Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card className="p-6">
            <VendorApplications />
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card className="p-6">
            <VendorTable />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorsPage;