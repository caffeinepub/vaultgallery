import LoginButton from '../components/auth/LoginButton';

export default function LoginScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <img
            src="/assets/generated/app-logo.dim_512x512.png"
            alt="Vault Gallery"
            className="mx-auto h-24 w-24"
          />
          <h1 className="text-4xl font-bold tracking-tight">Vault Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Your personal photo and video gallery with privacy protection
          </p>
        </div>
        <div className="space-y-4">
          <LoginButton />
          <p className="text-sm text-muted-foreground">
            Sign in to access your secure gallery
          </p>
        </div>
      </div>
    </div>
  );
}
