import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <h2 className="txt-xlarge font-semibold">
          Already have an account?
        </h2>
        <span className="txt-medium text-gray-500 mt-2">
          Sign in for a better experience.
        </span>
      </div>
      <div>
        <LocalizedClientLink href="/login">
          <button
            className="h-10"
            data-testid="sign-in-button"
          >
            Sign in
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
