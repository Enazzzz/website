"use client";

/**
 * Password gate shown before entering the main console.
 */
export function ConsoleLogin({
	password,
	onPasswordChange,
	onSubmit,
	errorMessage,
	isSubmitting,
}: {
	password: string;
	onPasswordChange: (value: string) => void;
	onSubmit: () => void;
	errorMessage: string | null;
	isSubmitting: boolean;
}) {
	return (
		<div className="min-h-screen bg-[color:var(--bg)] px-6 py-12">
			<main className="mx-auto w-full max-w-lg section-card">
				<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Admin Console</p>
				<h1 className="mt-2 text-3xl font-bold text-white">Sign in</h1>
				<p className="mt-3 text-sm text-white/70">
					Enter your admin password to edit portfolio content online.
				</p>
				<div className="mt-6 grid gap-3">
					<label htmlFor="console-login-password" className="text-sm text-white/80">
						Password
					</label>
					<input
						id="console-login-password"
						type="password"
						className="input-field"
						value={password}
						onChange={(event) => onPasswordChange(event.target.value)}
						placeholder="Enter admin password"
					/>
					<button type="button" className="button-main w-fit" onClick={onSubmit} disabled={isSubmitting}>
						{isSubmitting ? "Signing in..." : "Log in"}
					</button>
					{errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}
				</div>
			</main>
		</div>
	);
}
