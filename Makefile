# 1. Compiler Settings
CXX = g++
# -std=c++17: Use modern C++ features
# -Wall: Enable all warnings (Strict coding)
# -Iinclude: Tell compiler to look in the 'include' folder for headers
CXXFLAGS = -std=c++17 -Wall -Iinclude

# 2. Source and Output config
# We list our source files here
SRC = src/main.cpp src/OrderBook.cpp

# We convert the .cpp filenames to .o (Object files)
OBJ = $(SRC:.cpp=.o)

# The name of the final executable program
TARGET = limitx_engine

# 3. The Build Rules
# The default rule (runs when you type 'make')
all: $(TARGET)

# Link the object files to create the executable
$(TARGET): $(OBJ)
	@echo "🔗 Linking object files..."
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJ)
	@echo "✅ Build Complete! Run ./$(TARGET) to start."

# Compile source files into object files
# $< means the input file (.cpp), $@ means the output file (.o)
.cpp.o:
	@echo "🔨 Compiling $<..."
	$(CXX) $(CXXFLAGS) -c $< -o $@

# 4. Clean Rule (runs when you type 'make clean')
clean:
	@echo "🧹 Cleaning up..."
	rm -f src/*.o $(TARGET) $(TARGET).exe