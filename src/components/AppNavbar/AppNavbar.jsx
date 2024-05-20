import React from "react";
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoginStatus } from "../../redux/actions";
import AppModal from "../AppModal/AppModal";

export default function AppNavbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const nav = useNavigate();

    const dispatch = useDispatch();

    const logout = () => {
        localStorage.clear();
        dispatch(setLoginStatus(false));
        nav('/');
    }

    const menuItems = [
        "Home",
        "Log Out",
    ];

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}

        >
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <img src="https://i.pinimg.com/originals/01/39/93/0139937c2f641ab61fd020844ccfd459.png" className="w-12" />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarBrand>
                    <img src="https://i.pinimg.com/originals/01/39/93/0139937c2f641ab61fd020844ccfd459.png" className="w-12" />

                </NavbarBrand>

                <NavbarItem isActive>
                    <Link href="#" aria-current="page" className="text-black">
                        New & Featured
                    </Link>
                </NavbarItem>

            </NavbarContent>

            <NavbarContent justify="end">

                <Dropdown placement="bottom-end">

                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform md:w-10 md:h-10"
                        />

                    </DropdownTrigger>

                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">{localStorage.getItem("username")}</p>
                        </DropdownItem>

                        <DropdownItem key="logout" color="danger" onClick={logout}>
                            Log Out
                        </DropdownItem>

                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color={
                                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
