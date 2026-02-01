"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Users,
  Filter,
  MoreVertical,
  Edit2,
  UserX,
  Upload,
} from "lucide-react";
import {
  platformUsers,
  departments,
  teams,
  getDepartmentById,
  getTeamById,
  type PlatformUser,
  type UserRole,
} from "@/data/adminData";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const filtered = platformUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">User Management</h1>
          <p className="text-slate-500 mt-1">
            Create, edit, deactivate users. Assign roles, departments, teams, and managers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            <Upload className="w-5 h-5" />
            Bulk upload (CSV)
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700"
          >
            <Plus className="w-5 h-5" />
            Add user
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="all">All roles</option>
          <option value="learner">Learners</option>
          <option value="instructor">Instructors</option>
          <option value="manager">Managers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Role</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Department / Team</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Manager</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-700">Courses</th>
                <th className="w-12 py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const dept = u.departmentId ? getDepartmentById(u.departmentId) : null;
                const team = u.teamId ? getTeamById(u.teamId) : null;
                const manager = u.managerId ? platformUsers.find((p) => p.id === u.managerId) : null;
                return (
                  <tr key={u.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-800">{u.name}</p>
                        <p className="text-sm text-slate-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {dept?.name ?? "—"} {team ? ` / ${team.name}` : ""}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {manager?.name ?? "—"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-slate-600">
                      {u.role === "learner" ? u.enrolledCourseIds.length : u.role === "instructor" ? u.assignedCourseIds.length : "—"}
                    </td>
                    <td className="py-4 px-4 relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === u.id && (
                        <div className="absolute right-0 top-full mt-1 py-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                          <Link
                            href={`/dashboard/admin/users/${u.id}`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit / View profile
                          </Link>
                          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
                            <UserX className="w-4 h-4" />
                            Deactivate
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          No users match your filters.
        </div>
      )}

      {openMenuId && (
        <div className="fixed inset-0 z-0" onClick={() => setOpenMenuId(null)} aria-hidden />
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800">Add user</h3>
            <p className="text-sm text-slate-500 mt-1">Create a new user and assign role.</p>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg" placeholder="email@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg">
                  <option value="learner">Learner</option>
                  <option value="instructor">Instructor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg">
                  <option value="">—</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Team</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg">
                  <option value="">—</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </form>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
                Create user
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800">Bulk upload users</h3>
            <p className="text-sm text-slate-500 mt-1">Upload a CSV with columns: name, email, role, departmentId, teamId, managerId</p>
            <div className="mt-6 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Drop CSV file or click to browse</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowBulkUpload(false)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => setShowBulkUpload(false)} className="px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
