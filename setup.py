from setuptools import setup, find_packages

setup(
    name="chess-engine-ai3046",
    version="1.0.0",
    description="RL Chess Engine with minimax + alpha-beta pruning for Streamlit",
    author="AI3046",
    url="https://github.com/yourusername/chess-engine",
    python_requires=">=3.8",
    packages=find_packages(),
    install_requires=[
        "streamlit>=1.28.0",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
)
