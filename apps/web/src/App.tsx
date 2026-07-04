import { useEffect, useState } from "react";
import type { User } from "@repo/shared";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/users", { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Users</h1>

        {loading && <p className="text-gray-500">Loading users…</p>}

        {error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            Failed to load users: {error}
          </p>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="text-gray-500">No users yet.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-gray-900">
                  {user.name ?? "Unnamed user"}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
