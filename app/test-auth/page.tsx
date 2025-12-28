"use client";

import { useState } from "react";
import { authApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAuthPage() {
  const [email, setEmail] = useState("patient@bisheshoggo.ai");
  const [password, setPassword] = useState("patient123");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await authApi.login(email, password);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await authApi.register({
        email: "newuser@test.com",
        password: "test123",
        full_name: "New Test User",
        phone: "+8801234567890",
        role: "patient",
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testLogin} disabled={loading}>
              {loading ? "Loading..." : "Test Login"}
            </Button>
            <Button onClick={testRegister} disabled={loading} variant="outline">
              {loading ? "Loading..." : "Test Register"}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <strong className="text-green-800">Success!</strong>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold mb-2">API Configuration:</h3>
            <p className="text-sm">
              API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


