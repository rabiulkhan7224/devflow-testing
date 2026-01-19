import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";

import { render, screen, fireEvent } from "@testing-library/react";

describe("AuthForm Component - TDD Approach", () => {


    describe("sign in from", () => {
        describe("rendering", () => {
            it("should render the sign in form with email and password fields", () => {
                render(
                    <AuthForm
                        schema={SignInSchema}
                        defaultValues={{ email: "", password: "" }}
                        onSubmit={jest.fn()}
                        formType="SIGN_IN"
                    />
                );
                // Query the field using the label text
                expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
                expect(screen.getByLabelText("Password")).toBeInTheDocument();
                expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
                expect(screen.getByText("Don’t have an account?")).toBeInTheDocument();
            })
        })

        describe("sign up form", () => {

        })
    })
})
