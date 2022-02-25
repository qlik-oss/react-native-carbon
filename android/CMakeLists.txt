cmake_minimum_required(VERSION 3.9.0)

add_library(carbon
        SHARED
        ../cpp/example.cpp
        ./cpp-adapter.cpp
        )

include_directories(
        ../../react-native/React
        ../../react-native/React/Base
        ../../react-native/ReactCommon/jsi
        ../cpp
)

set_target_properties(
        carbon PROPERTIES
        CXX_STANDARD 17
        CXX_EXTENSIONS OFF
        POSITION_INDEPENDENT_CODE ON
)

target_link_libraries(
        carbon
        android
)