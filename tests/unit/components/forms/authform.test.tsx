import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema, SignUpSchema } from "@/lib/validations";
import userEvent from "@testing-library/user-event";

import { render, screen, fireEvent } from "@testing-library/react";

const user = userEvent.setup();
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
            describe('Rendering', () => {
                it('should display all required fields', () => {
                    const onSubmit = jest.fn();

                    render(
                        <AuthForm
                            formType="SIGN_UP"
                            schema={SignUpSchema}
                            defaultValues={{ name: '', username: '', email: '', password: '' }}
                            onSubmit={onSubmit}
                        />,
                    );

                    expect(screen.getByLabelText('Name')).toBeInTheDocument();
                    expect(screen.getByLabelText('Username')).toBeInTheDocument();
                    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
                    expect(screen.getByLabelText('Password')).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
                    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
                });
            });

            describe('Form Submission', () => {

                it("should show validation error for invalid email", async () => {
                    const onSubmit = jest.fn();

                    render(
                        <AuthForm
                            schema={SignInSchema}
                            defaultValues={{ email: "", password: "" }}
                            onSubmit={onSubmit}
                            formType="SIGN_IN"
                        />
                    );
                    const emailInput = screen.getByLabelText("Email Address");
                    const passwordInput = screen.getByLabelText("Password");
                    const submitButton = screen.getByRole("button", { name: "Sign In" });
                    await user.type(emailInput, "test@invalid");
                    await user.type(passwordInput, "123123123");
                    await user.click(submitButton);

                    expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();

                    expect(onSubmit).not.toHaveBeenCalled();
                });

                it("should show validation error for short password", async () => {
                    const onSubmit = jest.fn();

                    render(
                        <AuthForm
                            schema={SignInSchema}
                            defaultValues={{ email: "", password: "" }}
                            onSubmit={onSubmit}
                            formType="SIGN_IN"
                        />
                    );

                    const emailInput = screen.getByLabelText("Email Address");
                    const passwordInput = screen.getByLabelText("Password");
                    const submitButton = screen.getByRole("button", { name: "Sign In" });

                    await user.type(emailInput, "valid@email.com");
                    await user.type(passwordInput, "123");
                    await user.click(submitButton);

                    expect(screen.getByText("Password must be at least 6 characters long.")).toBeInTheDocument();
                    expect(onSubmit).not.toHaveBeenCalled();
                });

            })

            describe("Validation", () => {
                it("should show validation error for missing name", async () => {
                    const onSubmit = jest.fn();

                    render(
                        <AuthForm
                            formType="SIGN_UP"
                            schema={SignUpSchema}
                            defaultValues={{ name: '', username: '', email: '', password: '' }}
                            onSubmit={onSubmit}
                        />,
                    );
                    const usernameInput = screen.getByLabelText("Username");
                    const emailInput = screen.getByLabelText("Email Address");
                    const passwordInput = screen.getByLabelText("Password");
                    const submitButton = screen.getByRole("button", { name: "Sign Up" });
                    const nameInput = screen.getByLabelText('Name');

                    // invalid data
                    await user.type(usernameInput, '@johndoe');
                    await user.type(nameInput, 'John Doe');
                    await user.type(emailInput, 'test@invalid');
                    await user.type(passwordInput, '123');
                    await user.click(submitButton);

                    expect(screen.getByText('Username can only contain letters, numbers, and underscores.')).toBeInTheDocument();
                    expect(screen.getByText('Please provide a valid email address.')).toBeInTheDocument();
                    expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
                    expect(onSubmit).not.toHaveBeenCalled();



                    // required fields
                    await user.clear(usernameInput);
                    await user.clear(nameInput);
                    await user.clear(emailInput);
                    await user.clear(passwordInput);

                    expect(screen.getByText('Username must be at least 3 characters long.')).toBeInTheDocument();
                    expect(screen.getByText('Name is required.')).toBeInTheDocument();
                    expect(screen.getByText('Email is required.')).toBeInTheDocument();
                    expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
                })

                it('should show validation error weak password', async () => {
                    const onSubmit = jest.fn();

                    render(
                        <AuthForm
                            formType="SIGN_UP"
                            schema={SignUpSchema}
                            defaultValues={{ name: '', username: '', email: '', password: '' }}
                            onSubmit={onSubmit}
                        />,
                    );

                    const usernameInput = screen.getByLabelText('Username');
                    const nameInput = screen.getByLabelText('Name');
                    const emailInput = screen.getByLabelText('Email Address');
                    const passwordInput = screen.getByLabelText('Password');
                    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

                    // Case 1: password without uppercase letters
                    //   await user.type(usernameInput, 'johndoe');
                    //   await user.type(nameInput, 'John Doe');
                    //   await user.type(emailInput, 'johndoe@gmail.com');
                    //   await user.type(passwordInput, '123456');
                    //   await user.click(submitButton);
                    //   expect(screen.getByText('Password must contain at least one uppercase letter.')).toBeInTheDocument();

                    await user.type(usernameInput, "johodoe")
                    await user.type(nameInput, 'John Doe')
                    await user.type(emailInput, 'johndoe@gmail.com');
                    await user.type(passwordInput, '123456')
                    await user.click(submitButton)
                    expect(screen.getByText('Password must contain at least one uppercase letter.')).toBeInTheDocument()


                    // Case 2: password without lowercase letters
                    await user.clear(passwordInput);
                    await user.type(passwordInput, '123456P');
                    expect(screen.getByText('Password must contain at least one lowercase letter.'));

                    // Case 3: password without special characters
                    await user.clear(passwordInput);
                    await user.type(passwordInput, '123456Ps');
                    expect(screen.getByText('Password must contain at least one special character.'));
                });


            })

        })
    })
})
