import { useState } from "react";
import { Magnifier } from "@gravity-ui/icons";

export default function UserManagementTable({ users, onRoleChange = null }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="glass-card rounded-xl shadow-sm overflow-hidden mb-xl">
      <div className="p-lg border-b border-surface-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <h4 className="font-h3 text-h3 text-on-surface">Manage Users</h4>
        <div className="relative w-full md:w-64">
          <Magnifier className="absolute left-sm top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full pl-lg pr-md py-sm rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary outline-none text-body-small"
            placeholder="Search users..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-lg py-md font-label-caps text-on-surface-variant">
                Name
              </th>
              <th className="px-lg py-md font-label-caps text-on-surface-variant">
                Email
              </th>
              <th className="px-lg py-md font-label-caps text-on-surface-variant">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="px-lg py-md font-semibold text-on-surface">
                    {user.name}
                  </td>
                  <td className="px-lg py-md text-on-surface-variant text-body-small">
                    {user.email}
                  </td>
                  <td className="px-lg py-md">
                    <select
                      className="bg-black border border-outline-variant rounded-lg px-sm py-xs text-body-small focus:ring-primary cursor-pointer text-on-surface"
                      value={user.role}
                      onChange={(e) => onRoleChange && onRoleChange(user.id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="artist">Artist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-lg text-on-surface-variant font-body-large">
                  No users found matching search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-md bg-surface-container-low border-t border-surface-variant flex justify-between items-center">
        <span className="text-body-small text-on-surface-variant">
          Showing 1-{filteredUsers.length} of {filteredUsers.length} users
        </span>
      </div>
    </section>
  );
}
