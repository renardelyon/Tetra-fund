# Tetra Fund!

![image](https://github.com/user-attachments/assets/5974b815-1980-45f6-b7a5-2aa392fa00c3)

Tetra Fund - The Donation Tracking app leverages ICP smart contracts and Web3 technology to provide real-time transparency in donation flows. Users can donate or start a fundraiser, with each donation assigned a unique Principal for tracking. With live tracking, users can always see where their money is and how it is being utilized.

This application's logic is written in Rust, a programming language known for its performance, safety, and reliability, making it ideal for building secure and efficient smart contracts on ICP.


## Project structure

The `/backend` folder contains the Rust smart contract:

- `Cargo.toml`, which defines the crate that will form the backend
- `lib.rs`, which contains the actual smart contract, and exports its interface

The `/frontend` folder contains web assets for the application's user interface. The user interface is written with plain JavaScript, but any frontend framework can be used.
