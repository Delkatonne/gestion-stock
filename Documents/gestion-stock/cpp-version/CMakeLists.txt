cmake_minimum_required(VERSION 3.10)
project(GestionStock)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

file(GLOB SOURCES "src/**/*.cpp" "src/*.cpp")
file(GLOB HEADERS "include/**/*.hpp")

add_executable(gestion_stock ${SOURCES} ${HEADERS})

target_compile_options(gestion_stock PRIVATE -Wall -Wextra)

# Pour Windows
if (WIN32)
    target_compile_definitions(gestion_stock PRIVATE _WIN32)
endif()