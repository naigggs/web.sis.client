"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconPlus,
  IconSearch,
  IconTrash,
  IconPencil,
  IconLoader2,
  IconShieldLock,
  IconUserCheck,
  IconUserX,
  IconUserOff,
  IconFilter,
  IconX,
  IconCheck,
} from "@tabler/icons-react";

import { useGetUsers } from "@/hooks/api/user/use-get-users";
import { useCreateUser } from "@/hooks/api/user/use-create-user";
import { usePatchUser } from "@/hooks/api/user/use-patch-user";
import { useHardDeleteUser } from "@/hooks/api/user/use-hard-delete-user";
import { UserResponse } from "@/data/interface/user";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Field,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

// ─── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ─── Role badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: UserResponse["role"] }) {
  const map: Record<UserResponse["role"], string> = {
    admin:
      "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-400",
    staff: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
    student:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  };
  return (
    <Badge className={`text-xs capitalize hover:opacity-100 ${map[role]}`}>
      {role}
    </Badge>
  );
}

// ─── Status badges ─────────────────────────────────────────────────────────────
function StatusBadges({ user }: { user: UserResponse }) {
  if (!user.isActive)
    return (
      <Badge className="text-xs gap-1 bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 hover:opacity-100">
        <IconUserX className="h-3 w-3" />
        Inactive
      </Badge>
    );
  if (user.isBlocked)
    return (
      <Badge className="text-xs gap-1 bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400 hover:opacity-100">
        <IconShieldLock className="h-3 w-3" />
        Blocked
      </Badge>
    );
  if (user.isSuspended)
    return (
      <Badge className="text-xs gap-1 bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400 hover:opacity-100">
        <IconUserOff className="h-3 w-3" />
        Suspended
      </Badge>
    );
  return (
    <Badge className="text-xs gap-1 bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 hover:opacity-100">
      <IconUserCheck className="h-3 w-3" />
      Active
    </Badge>
  );
}

// ─── Add User Dialog ───────────────────────────────────────────────────────────
interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
}

function AddUserDialog({ open, onClose }: AddUserDialogProps) {
  const { mutate: createUser, isPending } = useCreateUser();
  type CreatableRole = "admin" | "staff";
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "staff" as CreatableRole,
  });
  const [error, setError] = React.useState<string | null>(null);

  const reset = () => {
    setForm({ email: "", password: "", confirmPassword: "", role: "staff" });
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    createUser(
      {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
      },
      {
        onSuccess: () => {
          toast.success("User created successfully.");
          handleClose();
        },
        onError: (err) => {
          setError(err?.message ?? "Failed to create user.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Create a new system account with a role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <Field>
            <FieldLabel htmlFor="add-email">Email address</FieldLabel>
            <Input
              id="add-email"
              type="email"
              placeholder="user@school.edu"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="add-role">Role</FieldLabel>
            <Select
              value={form.role}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, role: v as CreatableRole }))
              }
            >
              <SelectTrigger id="add-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="add-password">Password</FieldLabel>
            <Input
              id="add-password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="add-confirm">Confirm password</FieldLabel>
            <Input
              id="add-confirm"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              required
            />
          </Field>
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <IconLoader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit User Dialog ──────────────────────────────────────────────────────────
interface EditUserDialogProps {
  user: UserResponse | null;
  onClose: () => void;
}

function EditUserDialog({ user, onClose }: EditUserDialogProps) {
  const { mutate: patchUser, isPending } = usePatchUser();
  const [form, setForm] = React.useState({
    email: "",
    role: "staff" as UserResponse["role"],
    isActive: true,
    isBlocked: false,
    isSuspended: false,
  });
  const [newPassword, setNewPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isBlocked: user.isBlocked,
        isSuspended: user.isSuspended,
      });
      setNewPassword("");
      setError(null);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    const payload = {
      email: form.email !== user.email ? form.email : undefined,
      role: form.role !== user.role ? form.role : undefined,
      isActive: form.isActive,
      isBlocked: form.isBlocked,
      isSuspended: form.isSuspended,
      password: newPassword || undefined,
    };
    patchUser(
      { userId: user.id, payload },
      {
        onSuccess: () => {
          toast.success("User updated successfully.");
          onClose();
        },
        onError: (err) => {
          setError(err?.message ?? "Failed to update user.");
        },
      },
    );
  };

  return (
    <Dialog open={!!user} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update account details and status.
          </DialogDescription>
        </DialogHeader>
        {user && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <Field>
              <FieldLabel htmlFor="edit-email">Email address</FieldLabel>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-role">Role</FieldLabel>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, role: v as UserResponse["role"] }))
                }
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-password">
                New password{" "}
                <span className="text-muted-foreground font-normal">
                  (leave blank to keep)
                </span>
              </FieldLabel>
              <Input
                id="edit-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>

            {/* Status toggles */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Account status</p>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                  checked={form.isActive}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isActive: !!v }))
                  }
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                  checked={form.isBlocked}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isBlocked: !!v }))
                  }
                />
                <span className="text-sm">Blocked</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                  checked={form.isSuspended}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isSuspended: !!v }))
                  }
                />
                <span className="text-sm">Suspended</span>
              </label>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <IconLoader2 className="h-4 w-4 animate-spin mr-1" />
                )}
                Save changes
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export function UsersSection() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const debouncedSearch = useDebounce(search);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [selectedRoles, setSelectedRoles] = React.useState<
    Set<UserResponse["role"]>
  >(new Set());
  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<UserResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<UserResponse | null>(
    null,
  );
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  const { data, isLoading, isFetching } = useGetUsers({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    roles: selectedRoles.size ? Array.from(selectedRoles) : undefined,
  });
  const allUsers = data?.users ?? [];
  const users = allUsers;
  const pagination = data?.pagination;

  const ROLES: UserResponse["role"][] = ["admin", "staff", "student"];

  const toggleRole = (role: UserResponse["role"]) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      next.has(role) ? next.delete(role) : next.add(role);
      return next;
    });
    setPage(1);
    setSelectedIds(new Set());
  };

  const { mutate: hardDelete, isPending: isDeleting } = useHardDeleteUser();

  React.useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [debouncedSearch, selectedRoles]);

  // Selection
  const allSelected =
    users.length > 0 && users.every((u) => selectedIds.has(u.id));
  const someSelected = users.some((u) => selectedIds.has(u.id)) && !allSelected;

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        users.forEach((u) => next.delete(u.id));
      } else {
        users.forEach((u) => next.add(u.id));
      }
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteOne = () => {
    if (!deleteTarget) return;
    hardDelete(deleteTarget.id, {
      onSuccess: () => {
        toast.success("User deleted.");
        setDeleteTarget(null);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteTarget.id);
          return next;
        });
      },
      onError: () => toast.error("Failed to delete user."),
    });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    let done = 0;
    let failed = 0;
    ids.forEach((id) => {
      hardDelete(id, {
        onSuccess: () => {
          done++;
          if (done + failed === ids.length) {
            if (failed === 0) toast.success(`${done} user(s) deleted.`);
            else toast.warning(`${done} deleted, ${failed} failed.`);
            setSelectedIds(new Set());
            setBulkDeleteOpen(false);
          }
        },
        onError: () => {
          failed++;
          if (done + failed === ids.length) {
            if (failed === 0) toast.success(`${done} user(s) deleted.`);
            else toast.warning(`${done} deleted, ${failed} failed.`);
            setSelectedIds(new Set());
            setBulkDeleteOpen(false);
          }
        },
      });
    });
  };

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm">
            Manage system accounts and their roles.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <IconPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
          <Input
            className="pl-9"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Role faceted filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <IconFilter className="h-4 w-4" />
              Role
              {selectedRoles.size > 0 && (
                <Badge className="ml-1 h-5 px-1.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {selectedRoles.size}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 p-2">
            <p className="text-xs font-medium text-muted-foreground px-1 pb-1.5">
              Filter by role
            </p>
            <Separator className="mb-1.5" />
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm capitalize hover:bg-accent transition-colors"
              >
                <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary/40">
                  {selectedRoles.has(role) && (
                    <IconCheck className="h-3 w-3 text-primary" />
                  )}
                </div>
                {role}
              </button>
            ))}
            {selectedRoles.size > 0 && (
              <>
                <Separator className="my-1.5" />
                <button
                  onClick={() => setSelectedRoles(new Set())}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
                >
                  <IconX className="h-3 w-3" />
                  Clear filter
                </button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active role filter chips */}
        {selectedRoles.size > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from(selectedRoles).map((role) => (
              <Badge
                key={role}
                variant="secondary"
                className="gap-1 capitalize text-xs pr-1"
              >
                {role}
                <button
                  onClick={() => toggleRole(role)}
                  className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                  aria-label={`Remove ${role} filter`}
                >
                  <IconX className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <IconTrash className="h-4 w-4" />
            Delete ({selectedIds.size})
          </Button>
        )}
        {isFetching && !isLoading && (
          <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  data-state={someSelected ? "indeterminate" : undefined}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  data-state={selectedIds.has(user.id) ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={() => toggleOne(user.id)}
                      aria-label={`Select ${user.email}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadges user={user} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(user.createdAt))}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditTarget(user)}
                        aria-label="Edit user"
                      >
                        <IconPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(user)}
                        aria-label="Delete user"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {pagination.totalItems} user{pagination.totalItems !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <AddUserDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <EditUserDialog user={editTarget} onClose={() => setEditTarget(null)} />

      {/* Single delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold">{deleteTarget?.email}</span>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteOne}
              disabled={isDeleting}
            >
              {isDeleting && (
                <IconLoader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirm */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.size} user{selectedIds.size !== 1 ? "s" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected accounts. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting && (
                <IconLoader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
