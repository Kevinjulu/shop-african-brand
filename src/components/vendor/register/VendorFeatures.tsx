import { Card, CardContent } from "@/components/ui/card";
import { Building2, ShieldCheck, BarChart, DollarSign } from "lucide-react";

const features = [
  {
    icon: <Building2 className="w-12 h-12 text-primary mb-4" />,
    title: "Business Verification",
    description: "Get verified status to build trust with buyers"
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-primary mb-4" />,
    title: "Secure Platform",
    description: "Advanced security measures to protect your business"
  },
  {
    icon: <BarChart className="w-12 h-12 text-primary mb-4" />,
    title: "Analytics Dashboard",
    description: "Track your performance and growth"
  },
  {
    icon: <DollarSign className="w-12 h-12 text-primary mb-4" />,
    title: "Global Payments",
    description: "Accept payments from customers worldwide"
  }
];

export const VendorFeatures = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {features.map((feature, index) => (
        <Card key={index} className="text-center p-6">
          <CardContent>
            <div className="flex flex-col items-center">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};