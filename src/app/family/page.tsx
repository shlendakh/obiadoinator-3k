"use client";

import { useEffect, useState, useCallback } from "react";
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

import CreatingFamilyForm from "./assets/CreatingFamilyForm";
import ChangeFamilyForm from "./assets/ChangeFamilyForm";

interface FamilyInfo {
  family?: Family;
  message?: string;
}

enum FooterState {
  Default,
  NoFamily,
  ChangeName,
  AddMembers,
  CreateFamily,
  DeleteFamily,
}

export default function FamilySettingsPage() {
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [footerState, setFooterState] = useState<FooterState>(
    FooterState.Default
  );
  const router = useRouter();

  const fetchFamilyInfo = useCallback(async () => {
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
      if (data.message) {
        setFooterState(FooterState.NoFamily);
      }
      setFamilyInfo(data);
    } catch (error) {
      console.error("Failed to fetch family info", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchFamilyInfo();
  }, [fetchFamilyInfo]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!familyInfo) {
    return <p>Error loading family information.</p>;
  }

  const handleFooterStateChange = (state: FooterState) => {
    setFooterState(state);
  };

  const handleNameChangeSuccess = () => {
    fetchFamilyInfo();
    setFooterState(FooterState.Default);
  };

  const renderFooterContent = () => {
    switch (footerState) {
      case FooterState.Default:
        return (
          <div className="flex flex-col gap-2 w-1/2">
            <Button
              onClick={() => handleFooterStateChange(FooterState.ChangeName)}
              className="w-full"
              variant="outline"
            >
              Change family name
            </Button>
            <Button
              onClick={() => handleFooterStateChange(FooterState.AddMembers)}
              className="w-full"
            >
              Add family members
            </Button>
            <Button
              onClick={() => handleFooterStateChange(FooterState.DeleteFamily)}
              className="w-full"
              variant="destructive"
            >
              Delete Family
            </Button>
          </div>
        );
      case FooterState.ChangeName:
        return (
          <ChangeFamilyForm
            familyId={familyInfo.family!.id}
            name={familyInfo.family!.name}
            onSuccess={handleNameChangeSuccess}
          />
        );
      case FooterState.AddMembers:
        return <></>;
      case FooterState.CreateFamily:
        return <CreatingFamilyForm onSuccess={handleNameChangeSuccess} />;
      case FooterState.NoFamily:
        return (
          <Button
            onClick={() => handleFooterStateChange(FooterState.CreateFamily)}
            className="w-full"
          >
            Create Family
          </Button>
        );
    }
  };

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
            <p className="text-slate-400 text-sm font-light">
              Family ID: {familyInfo.family?.id}
            </p>
            <p className="font-bold text-2xl">
              Family Name: {familyInfo.family?.name}
            </p>
          </div>
        )}
      </CardContent>
      <CardContent>
        <hr />
      </CardContent>
      <CardFooter className="w-full flex flex-col justify-center">
        {familyInfo ? (
          renderFooterContent()
        ) : (
          <Button
            className="w-full"
            onClick={() => handleFooterStateChange(FooterState.CreateFamily)}
          >
            Create <span className="ml-1 font-bold">Family</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
