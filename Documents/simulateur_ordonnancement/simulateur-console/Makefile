CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -pthread -O2
TARGET = simulateur

OBJS = main.o Process.o Scheduler.o Simulator.o

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)

main.o: main.cpp Simulator.hpp Scheduler.hpp Process.hpp
	$(CXX) $(CXXFLAGS) -c main.cpp

Process.o: Process.cpp Process.hpp
	$(CXX) $(CXXFLAGS) -c Process.cpp

Scheduler.o: Scheduler.cpp Scheduler.hpp ProcessQueue.hpp Process.hpp
	$(CXX) $(CXXFLAGS) -c Scheduler.cpp

Simulator.o: Simulator.cpp Simulator.hpp Scheduler.hpp ProcessQueue.hpp
	$(CXX) $(CXXFLAGS) -c Simulator.cpp

clean:
	rm -f $(OBJS) $(TARGET)

run: $(TARGET)
	./$(TARGET)

.PHONY: all clean run