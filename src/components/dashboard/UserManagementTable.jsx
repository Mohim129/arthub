import { Magnifier, TrashBin, ChevronLeft, ChevronRight } from "@gravity-ui/icons";

export default function UserManagementTable({ users }) {
  return (
    <section className="glass-card rounded-xl shadow-sm overflow-hidden mb-xl">
      <div className="p-lg border-b border-surface-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <h4 className="font-h3 text-h3 text-on-surface">Active Users</h4>
        <div className="relative w-full md:w-64">
          <Magnifier className="absolute left-sm top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full pl-lg pr-md py-sm rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary outline-none text-body-small"
            placeholder="Search users..."
            type="text"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-lg py-md font-label-caps text-on-surface-variant">
                User
              </th>
              <th className="px-lg py-md font-label-caps text-on-surface-variant">
                Role
              </th>
              <th className="px-lg py-md font-label-caps text-on-surface-variant">
                Status
              </th>
              <th className="px-lg py-md font-label-caps text-on-surface-variant">
                Last Active
              </th>
              <th className="px-lg py-md font-label-caps text-on-surface-variant text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-surface-container-low/50 transition-colors"
              >
                <td className="px-lg py-md">
                  <div className="flex items-center gap-sm">
                    <div
                      className={`w-10 h-10 rounded-full bg-${user.color}-container/20 flex items-center justify-center text-${user.color} font-bold`}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">
                        {user.name}
                      </p>
                      <p className="text-body-small text-on-surface-variant">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-lg py-md">
                  <select
                    className="bg-surface-bright border border-outline-variant rounded-lg px-sm py-xs text-body-small focus:ring-primary"
                    defaultValue={user.role}
                  >
                    <option>Artist</option>
                    <option>Collector</option>
                    <option>Admin</option>
                  </select>
                </td>
                <td className="px-lg py-md">
                  <span
                    className={`px-sm py-xs rounded-full text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-lg py-md text-on-surface-variant text-body-small">
                  {user.lastActive}
                </td>
                <td className="px-lg py-md text-right">
                  <button className="text-outline hover:text-error transition-colors">
                    <TrashBin />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-md bg-surface-container-low border-t border-surface-variant flex justify-between items-center">
        <span className="text-body-small text-on-surface-variant">
          Showing 1-10 of 1,284 users
        </span>
        <div className="flex gap-xs">
          <button className="p-xs rounded-lg hover:bg-surface-variant text-on-surface-variant">
            <ChevronLeft />
          </button>
          <button className="px-sm py-xs rounded-lg bg-primary text-on-primary font-semibold text-body-small">
            1
          </button>
          <button className="px-sm py-xs rounded-lg hover:bg-surface-variant text-on-surface-variant text-body-small">
            2
          </button>
          <button className="px-sm py-xs rounded-lg hover:bg-surface-variant text-on-surface-variant text-body-small">
            3
          </button>
          <button className="p-xs rounded-lg hover:bg-surface-variant text-on-surface-variant">
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
