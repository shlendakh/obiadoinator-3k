"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FamilyInfo {
  family?: Family;
  message?: string;
}

export default function FamilySettingsPage() {
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [createFamily, setCreateFamily] = useState<boolean>(false);
  const router = useRouter();

  const createFamilyClick = () => {
    setCreateFamily(true);
  };

  useEffect(() => {
    const fetchFamilyInfo = async () => {
      try {
        const session = await getSession();
        if (!session) {
          // If user is not authenticated, redirect to login
          router.push("/api/auth/signin");
          return;
        }
        const response = await fetch("/api/family");
        if (!response.ok) {
          throw new Error("Failed to fetch family info");
        }
        const data = await response.json();
        setFamilyInfo(data);
      } catch (error) {
        console.error("Failed to fetch family info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyInfo();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!familyInfo) {
    return <p>Error loading family information.</p>;
  }

  return (
    <Card className="mx-auto my-4 w-1/2">
      <CardHeader>
        <CardTitle>Family Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {familyInfo.message ? (
          <p>{familyInfo.message}</p>
        ) : (
          <div>
            <p>Family ID: {familyInfo.family?.id}</p>
            <p>Family Name: {familyInfo.family?.name}</p>
          </div>
        )}
      </CardContent>
      {!createFamily ? (
        <CardFooter>
          <Button className="w-full" onClick={createFamilyClick}>
            Create <span className="ml-1 font-bold">Family</span>
          </Button>
        </CardFooter>
      ) : (
        <></>
      )}
    </Card>
  );
}
