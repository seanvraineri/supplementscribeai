"use client";

import { useFormContext } from "react-hook-form";
import { OnboardingData } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DataPoint: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="text-sm text-right">{value || "Not provided"}</dd>
  </div>
);

export function ReviewStep() {
  const { getValues } = useFormContext<OnboardingData>();
  const data = getValues();

  const renderArray = (items: { value: string }[] | undefined) => {
    if (!items || items.length === 0) return "None";
    return (
      <ul className="list-disc list-inside">
        {items.map((item, i) => <li key={i}>{item.value}</li>)}
      </ul>
    )
  };

  const renderGoals = (goals: string[] | undefined, customGoals: { value: string }[] | undefined) => {
    const allGoals = [
      ...(goals || []),
      ...(customGoals?.map(g => g.value).filter(Boolean) || [])
    ];
    if (allGoals.length === 0) return "None";
    return (
      <ul className="list-disc list-inside">
        {allGoals.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    )
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Review Your Information</h3>
        <p className="text-sm text-muted-foreground">
          Please confirm that the information below is correct before submitting.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <DataPoint label="Full Name" value={data.fullName} />
            <DataPoint label="Age" value={data.age} />
            <DataPoint label="Gender" value={data.gender} />
            <DataPoint label="Height" value={`${data.height_ft} ft ${data.height_in} in`} />
            <DataPoint label="Weight" value={`${data.weight_lbs} lbs`} />
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <DataPoint label="Activity Level" value={data.activity_level} />
            <DataPoint label="Average Sleep" value={`${data.sleep_hours} hours/night`} />
            <DataPoint label="Alcohol Intake" value={data.alcohol_intake} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {renderGoals(data.healthGoals, data.customHealthGoals)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Allergies</h4>
            {renderArray(data.allergies)}
          </div>
          <div>
            <h4 className="font-semibold">Medical Conditions</h4>
            {renderArray(data.conditions)}
          </div>
          <div>
            <h4 className="font-semibold">Medications</h4>
            {renderArray(data.medications)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 